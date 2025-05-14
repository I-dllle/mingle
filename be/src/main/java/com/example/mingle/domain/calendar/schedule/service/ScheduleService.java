//package com.example.mingle.domain.calendar.schedule.service;
//
//import com.example.mingle.domain.calendar.schedule.dto.ScheduleRequest;
//import com.example.mingle.domain.calendar.schedule.dto.ScheduleResponse;
//import com.example.mingle.domain.calendar.schedule.entity.Schedule;
//import com.example.mingle.domain.calendar.schedule.entity.ScheduleStatus;
//import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
//import com.example.mingle.domain.calendar.schedule.repository.ScheduleRepository;
//import com.example.mingle.domain.calendar.schedule.util.ScheduleMapper;
//import com.example.mingle.domain.post.post.entity.Post;
//import com.example.mingle.domain.user.user.entity.User;
//import com.example.mingle.domain.user.user.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.DayOfWeek;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.YearMonth;
//import java.time.temporal.WeekFields;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RequiredArgsConstructor
//@Service
//public class ScheduleService {
//
//    private final ScheduleRepository scheduleRepository;
//    private final UserRepository userRepository;
//    private final PostRepository postRepository;
//    private final ScheduleMapper scheduleMapper;
//
//    // 일정 생성
//    @Transactional
//    public ScheduleResponse createSchedule(ScheduleRequest request, Long userId, Long postId) {
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
//
//        //기본적으로 post를 null로 설정.
//        Post post = null;
//        if (postId != null) {
//            post = postRepository.findById(postId).orElseThrow(
//                    () -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
//        }
//
//        Schedule schedule = scheduleMapper.toEntity(request, user, post);
//
//        Schedule saved = scheduleRepository.save(schedule);
//        return scheduleMapper.toResponse(saved);
//    }
//
//    // 상태별 일정 조회
//    @Transactional(readOnly = true)
//    public List<ScheduleResponse> getSchedulesByStatus(Long userId, ScheduleStatus status) {
//        List<Schedule> schedules = scheduleRepository.findByUserIdAndScheduleStatus(userId, status);
//        return schedules.stream()
//                .map(scheduleMapper::toResponse)
//                .collect(Collectors.toList());
//    }
//
//
//    // 월별 타입에 따라 조회 (LocalDate 기반으로 수정)
//    @Transactional(readOnly = true)
//    public List<ScheduleResponse> getMonthlyView(
//            Long userId,
//            ScheduleType type,
//            LocalDate date
//    ) {
//        if (userId == null) {
//            throw new IllegalArgumentException("유저 ID는 필수입니다.");
//        }
//
//        // 기준 날짜가 없으면 현재 날짜 사용
//        LocalDate targetDate = date != null ? date : LocalDate.now();
//
//        // 해당 월의 YearMonth 생성
//        YearMonth ym = YearMonth.from(targetDate);
//
//        // 해당 월의 시작·끝 시점 계산
//        LocalDateTime start = ym.atDay(1).atStartOfDay();
//        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
//        Long departmentId = user.getDepartment().getId();
//
//        List<Schedule> schedules;
//        if (type == null) {
//            // 타입 무관하게 사용자의 모든 일정 조회
//
//            // 사용자의 개인 일정 조회
//            List<Schedule> personalSchedules = scheduleRepository.findByUserIdAndScheduleTypeAndStartTimeBetween(
//                    userId, ScheduleType.PERSONAL, start, end);
//
//            // 회사 전체 일정 조회
//            List<Schedule> companySchedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
//                    ScheduleType.COMPANY, start, end);
//
//            // 팀 일정 조회
//            List<Schedule> teamSchedules = scheduleRepository.findByUser_DepartmentIdAndScheduleTypeAndStartTimeBetween(
//                    departmentId,ScheduleType.DEPARTMENT, start, end);
//
//            schedules = new ArrayList<>();
//            schedules.addAll(personalSchedules);
//            schedules.addAll(companySchedules);
//            schedules.addAll(teamSchedules);
//
//        } else if (type == ScheduleType.COMPANY) {
//            // 회사 일정은 모든 사용자 공통
//            schedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
//                    type, start, end);
//        } else if (type == ScheduleType.DEPARTMENT) {
//            // 팀 일정은 사용자가 속한 팀의 모든 일정
//            schedules = scheduleRepository.findByUser_DepartmentIdAndScheduleTypeAndStartTimeBetween(
//                     departmentId, type, start, end);
//        } else {
//            // 개인 일정 조회 (PERSONAL)
//            schedules = scheduleRepository.findByUserIdAndScheduleTypeAndStartTimeBetween(
//                    userId, type, start, end);
//        }
//
//        // DTO 변환
//        return scheduleMapper.toResponseList(schedules);
//    }
//
//
//    // 주간 뷰 조회
//    @Transactional(readOnly = true)
//    public List<ScheduleResponse> getWeeklyView(Long userId, LocalDate date, ScheduleType type) {
//        if (userId == null) {
//            throw new IllegalArgumentException("유저 ID는 필수입니다.");
//        }
//
//        // 기준 날짜가 없으면 현재 날짜 사용
//        LocalDate targetDate = date != null ? date : LocalDate.now();
//
//        // "일요일 시작, 1일을 첫 번째 요일로" 정의
//        WeekFields wf = WeekFields.of(DayOfWeek.SUNDAY, 1);
//        // 해당 날짜가 속한 주의 시작일(일요일)과 종료일(토요일) 계산
//        // dayOfWeek 1 → 일요일, 7 → 토요일
//        LocalDate startOfWeek = targetDate.with(wf.dayOfWeek(), 1);
//        LocalDate endOfWeek = targetDate.with(wf.dayOfWeek(), 7);
//
//        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
//        LocalDateTime endDateTime = endOfWeek.atTime(23, 59, 59);
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
//        Long departmentId = user.getDepartment().getId();
//
//        List<Schedule> schedules;
//        if (type == null) {
//            // 타입 무관하게 사용자의 모든 일정 조회
//
//            // 사용자의 개인 일정 조회
//            List<Schedule> personalSchedules = scheduleRepository.findByUserIdAndScheduleTypeAndStartTimeBetween(
//                    userId, ScheduleType.PERSONAL, startDateTime, endDateTime);
//
//            // 회사 전체 일정 조회
//            List<Schedule> companySchedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
//                    ScheduleType.COMPANY, startDateTime, endDateTime);
//
//            // 팀 일정 조회
//            List<Schedule> teamSchedules = scheduleRepository.findByUser_DepartmentIdAndScheduleTypeAndStartTimeBetween(
//                    departmentId, ScheduleType.DEPARTMENT, startDateTime, endDateTime);
//
//            schedules = new ArrayList<>();
//            schedules.addAll(personalSchedules);
//            schedules.addAll(companySchedules);
//            schedules.addAll(teamSchedules);
//
//        } else if (type == ScheduleType.COMPANY) {
//            // 회사 일정은 모든 사용자 공통
//            schedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
//                    type, startDateTime, endDateTime);
//        } else if (type == ScheduleType.DEPARTMENT) {
//            // 팀 일정은 사용자가 속한 팀의 모든 일정
//            schedules = scheduleRepository.findByUser_DepartmentIdAndScheduleTypeAndStartTimeBetween(
//                    departmentId, type, startDateTime, endDateTime);
//        } else {
//            // 개인 일정 조회 (PERSONAL)
//            schedules = scheduleRepository.findByUserIdAndScheduleTypeAndStartTimeBetween(
//                    userId, type, startDateTime, endDateTime);
//        }
//
//        return scheduleMapper.toResponseList(schedules);
//    }
//
//
//
//    // 일간 뷰 조회
//    @Transactional(readOnly = true)
//    public List<ScheduleResponse> getDailyView(Long userId, LocalDate date, ScheduleType type) {
//        if (userId == null) {
//            throw new IllegalArgumentException("유저 ID는 필수입니다.");
//        }
//
//        // 기준 날짜가 없으면 현재 날짜 사용
//        LocalDate targetDate = date != null ? date : LocalDate.now();
//
//        LocalDateTime startDateTime = targetDate.atStartOfDay();
//        LocalDateTime endDateTime = targetDate.atTime(23, 59, 59);
//
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
//        Long departmentId = user.getDepartment().getId();
//
//        List<Schedule> schedules;
//        if (type == null) {
//            // 타입 무관하게 사용자의 모든 일정 조회
//
//            // 사용자의 개인 일정 조회
//            List<Schedule> personalSchedules = scheduleRepository.findByUserIdAndScheduleTypeAndStartTimeBetween(
//                    userId, ScheduleType.PERSONAL, startDateTime, endDateTime);
//
//            // 회사 전체 일정 조회
//            List<Schedule> companySchedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
//                    ScheduleType.COMPANY, startDateTime, endDateTime);
//
//            // 팀 일정 조회
//            List<Schedule> teamSchedules = scheduleRepository.findByUser_DepartmentIdAndScheduleTypeAndStartTimeBetween(
//                    departmentId, ScheduleType.DEPARTMENT, startDateTime, endDateTime);
//
//            schedules = new ArrayList<>();
//            schedules.addAll(personalSchedules);
//            schedules.addAll(companySchedules);
//            schedules.addAll(teamSchedules);
//
//        } else if (type == ScheduleType.COMPANY) {
//            // 회사 일정은 모든 사용자 공통
//            schedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
//                    type, startDateTime, endDateTime);
//        } else if (type == ScheduleType.DEPARTMENT) {
//            // 팀 일정은 사용자가 속한 팀의 모든 일정
//            schedules = scheduleRepository.findByUser_DepartmentIdAndScheduleTypeAndStartTimeBetween(
//                    departmentId, type, startDateTime, endDateTime);
//        } else {
//            // 개인 일정 조회 (PERSONAL)
//            schedules = scheduleRepository.findByUserIdAndScheduleTypeAndStartTimeBetween(
//                    userId, type, startDateTime, endDateTime);
//        }
//
//        // 일관성 있는 매퍼 사용
//        return scheduleMapper.toResponseList(schedules);
//    }
//
//
//    //일정 수정
//    @Transactional
//    public ScheduleResponse updateSchedule(ScheduleRequest request, Long scheduleId, Long userId) {
//        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
//                () -> new IllegalArgumentException("존재하지 않는 일정입니다.")
//        );
//
//        if (!schedule.getUser().getId().equals(userId)) {
//            throw new IllegalArgumentException("수정 권한이 없습니다.");
//        }
//
//        // request dto로부터 받은 정보를 entity에 적용
//        scheduleMapper.updateEntityFromRequest(schedule, request);
//
//        // 슈뢰딩거 고양이기 때문에 post 업데이트 따로 처리하도록 하자.
//        Post post = request.getPostId() != null
//                ? postRepository.findById(request.getPostId()).orElseThrow(
//                () -> new IllegalArgumentException("존재하지 않는 게시글입니다."))
//                : null;
//        schedule.setPost(post);
//
//
//        return scheduleMapper.toResponse(schedule);
//    }
//
//
//    //일정 삭제
//    @Transactional
//    public void deleteSchedule(Long scheduleId, Long userId) {
//        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
//                () -> new IllegalArgumentException("존재하지 않는 일정입니다.")
//        );
//        if (!schedule.getUser().getId().equals(userId)) {
//            throw new IllegalArgumentException("삭제 권한이 없습니다.");
//        }
//        scheduleRepository.deleteById(scheduleId);
//    }
//}
//
