package com.example.mingle.domain.schedule.service;

import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.post.post.repository.PostRepository;
import com.example.mingle.domain.schedule.dto.ScheduleRequest;
import com.example.mingle.domain.schedule.dto.ScheduleResponse;
import com.example.mingle.domain.schedule.entity.Schedule;
import com.example.mingle.domain.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.schedule.entity.ScheduleType;
import com.example.mingle.domain.schedule.repository.ScheduleRepository;
import com.example.mingle.domain.schedule.util.ScheduleMapper;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ScheduleMapper scheduleMapper;
    private final DepartmentRepository departmentRepository;

    // 단건 조회
    @Transactional(readOnly = true)
    public ScheduleResponse getScheduleById(Long userId, Long scheduleId) {
        if (!userRepository.existsById(userId)) {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }
        Schedule schedule = scheduleRepository.findByUser_IdAndId(userId, scheduleId)
                .orElseThrow(() -> new ApiException(ErrorCode.SCHEDULE_NOT_FOUND));
        // 2) 변환해서 리턴
        return scheduleMapper.toResponse(schedule);
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> searchVisibleSchedules(
            Long userId,
            Long departmentId,
            String keyword,
            boolean includeMemo
    ) {
        // 키워드 null·빈값 방어
        String kw = keyword == null ? "" : keyword.trim();

        List<Schedule> list = includeMemo
                ? scheduleRepository.searchTitleOrMemoAllVisible(userId, departmentId, kw)
                : scheduleRepository.searchTitleAllVisible(userId, departmentId, kw);

        return list.stream()
                .map(scheduleMapper::toResponse)
                .collect(Collectors.toList());
    }


    // 개인 일정 생성
    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request, Long userId, Long postId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        //기본적으로 post를 null로 설정.
        Post post = null;
        if (postId != null) {
            post = postRepository.findById(postId).orElseThrow(
                    () -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        }

        Schedule schedule = scheduleMapper.toEntity(request, user, post);
        schedule.setScheduleType(ScheduleType.PERSONAL);
        Schedule saved = scheduleRepository.save(schedule);
        return scheduleMapper.toResponse(saved);
    }

    // 개인 상태에따라서 일정 조회
    @Transactional(readOnly = true)
    public Page<ScheduleResponse> getSchedulesByStatus(
            Long userId,
            ScheduleStatus status,
            ScheduleType type,
            Pageable pageable
    ) {
        switch (type) {
            case PERSONAL:
                return scheduleRepository
                        .findByUserIdAndScheduleStatus(userId, status, pageable)
                        .map(scheduleMapper::toResponse);

            case COMPANY:
                return scheduleRepository
                        .findByScheduleTypeAndScheduleStatus(
                                ScheduleType.COMPANY, status, pageable)
                        .map(scheduleMapper::toResponse);

            case DEPARTMENT:
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
                Long deptId = user.getDepartment().getId();
                return scheduleRepository
                        .findByDepartment_IdAndScheduleTypeAndScheduleStatus(
                                deptId, ScheduleType.DEPARTMENT, status, pageable)
                        .map(scheduleMapper::toResponse);

            default:
                // 전체 타입(개인+회사+부서) 합치기
                Long myDeptId = userRepository.findById(userId)
                        .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND))
                        .getDepartment().getId();
                return scheduleRepository
                        .findAllVisibleSchedules(status, userId, myDeptId, pageable)
                        .map(scheduleMapper::toResponse);
        }
    }

    // 월별 타입에 따라 조회
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getMonthlyView(
            Long userId,
            ScheduleType type,
            LocalDate date,
            Long departmentId
    ) {
        if (userId == null) {
            throw new IllegalArgumentException("유저 ID는 필수입니다.");
        }

        // 기준 날짜가 없으면 현재 날짜 사용
        LocalDate targetDate = date != null ? date : LocalDate.now();
        // 해당 월의 YearMonth 생성
        YearMonth ym = YearMonth.from(targetDate);
        // 해당 월의 시작·끝 시점 계산
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        Long finalDepartmentId = isAdmin && departmentId != null
                ? departmentId
                : user.getDepartment().getId();

        List<Schedule> schedules;
        if (type == null) {
            // 타입 무관하게 사용자의 모든 일정 조회

            // 사용자의 개인 일정 조회
            List<Schedule> personalSchedules = scheduleRepository.findByUserIdAndScheduleTypeBetweenWithUser(
                    userId, ScheduleType.PERSONAL, start, end);

            // 회사 전체 일정 조회
            List<Schedule> companySchedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
                    ScheduleType.COMPANY, start, end);

            // 팀 일정 조회
            List<Schedule> teamSchedules = scheduleRepository.findByDepartment_IdAndScheduleTypeAndStartTimeBetween(
                    finalDepartmentId, ScheduleType.DEPARTMENT, start, end);

            schedules = new ArrayList<>();
            schedules.addAll(personalSchedules);
            schedules.addAll(companySchedules);
            schedules.addAll(teamSchedules);

        } else if (type == ScheduleType.COMPANY) {
            // 회사 일정은 모든 사용자 공통
            schedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
                    type, start, end);
        } else if (type == ScheduleType.DEPARTMENT) {
            // 팀 일정은 사용자가 속한 팀의 모든 일정
            schedules = scheduleRepository.findByDepartment_IdAndScheduleTypeAndStartTimeBetween(
                    finalDepartmentId, type, start, end);
        } else {
            // 개인 일정 조회 (PERSONAL)
            schedules = scheduleRepository.findByUserIdAndScheduleTypeBetweenWithUser(
                    userId, type, start, end);
        }

        // DTO 변환
        return scheduleMapper.toResponseList(schedules);
    }


    // 주간 타입에 따라 조회
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getWeeklyView(Long userId, LocalDate date, ScheduleType type, Long departmentId) {
        if (userId == null) {
            throw new IllegalArgumentException("유저 ID는 필수입니다.");
        }

        // 기준 날짜가 없으면 현재 날짜 사용
        LocalDate targetDate = date != null ? date : LocalDate.now();

        // "일요일 시작, 1일을 첫 번째 요일로" 정의
        WeekFields wf = WeekFields.of(DayOfWeek.SUNDAY, 1);
        // 해당 날짜가 속한 주의 시작일(일요일)과 종료일(토요일) 계산
        // dayOfWeek 1 → 일요일, 7 → 토요일
        LocalDate startOfWeek = targetDate.with(wf.dayOfWeek(), 1);
        LocalDate endOfWeek = targetDate.with(wf.dayOfWeek(), 7);

        LocalDateTime startDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endDateTime = endOfWeek.atTime(23, 59, 59);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        Long finalDepartmentId = isAdmin && departmentId != null
                ? departmentId
                : user.getDepartment().getId();

        List<Schedule> schedules;
        if (type == null) {
            // 타입 무관하게 사용자의 모든 일정 조회

            // 사용자의 개인 일정 조회
            List<Schedule> personalSchedules = scheduleRepository.findByUserIdAndScheduleTypeBetweenWithUser(
                    userId, ScheduleType.PERSONAL, startDateTime, endDateTime);

            // 회사 전체 일정 조회
            List<Schedule> companySchedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
                    ScheduleType.COMPANY, startDateTime, endDateTime);

            // 팀 일정 조회
            List<Schedule> teamSchedules = scheduleRepository
                    .findByDepartment_IdAndScheduleTypeAndStartTimeBetween(
                            finalDepartmentId, ScheduleType.DEPARTMENT, startDateTime, endDateTime);

            schedules = new ArrayList<>();
            schedules.addAll(personalSchedules);
            schedules.addAll(companySchedules);
            schedules.addAll(teamSchedules);

        } else if (type == ScheduleType.COMPANY) {
            // 회사 일정은 모든 사용자 공통
            schedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
                    type, startDateTime, endDateTime);
        } else if (type == ScheduleType.DEPARTMENT) {
            // 팀 일정은 사용자가 속한 팀의 모든 일정
            schedules = scheduleRepository.findByDepartment_IdAndScheduleTypeAndStartTimeBetween(
                    finalDepartmentId, type, startDateTime, endDateTime);
        } else {
            // 개인 일정 조회 (PERSONAL)
            schedules = scheduleRepository.findByUserIdAndScheduleTypeBetweenWithUser(
                    userId, type, startDateTime, endDateTime);
        }

        return scheduleMapper.toResponseList(schedules);
    }


    // 일간 타입에 따라 조회
    @Transactional(readOnly = true)
    public List<ScheduleResponse> getDailyView(Long userId, LocalDate date, ScheduleType type, Long departmentId) {
        if (userId == null) {
            throw new IllegalArgumentException("유저 ID는 필수입니다.");
        }

        // 기준 날짜가 없으면 현재 날짜 사용
        LocalDate targetDate = date != null ? date : LocalDate.now();

        LocalDateTime startDateTime = targetDate.atStartOfDay();
        LocalDateTime endDateTime = targetDate.atTime(23, 59, 59);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        Long finalDepartmentId = isAdmin && departmentId != null
                ? departmentId
                : user.getDepartment().getId();

        List<Schedule> schedules;
        if (type == null) {
            // 타입 무관하게 사용자의 모든 일정 조회

            // 사용자의 개인 일정 조회
            List<Schedule> personalSchedules = scheduleRepository.findByUserIdAndScheduleTypeBetweenWithUser(
                    userId, ScheduleType.PERSONAL, startDateTime, endDateTime);

            // 회사 전체 일정 조회
            List<Schedule> companySchedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
                    ScheduleType.COMPANY, startDateTime, endDateTime);

            // 팀 일정 조회
            List<Schedule> teamSchedules = scheduleRepository.findByDepartment_IdAndScheduleTypeAndStartTimeBetween(
                    finalDepartmentId, ScheduleType.DEPARTMENT, startDateTime, endDateTime);

            schedules = new ArrayList<>();
            schedules.addAll(personalSchedules);
            schedules.addAll(companySchedules);
            schedules.addAll(teamSchedules);

        } else if (type == ScheduleType.COMPANY) {
            // 회사 일정은 모든 사용자 공통
            schedules = scheduleRepository.findByScheduleTypeAndStartTimeBetween(
                    type, startDateTime, endDateTime);
        } else if (type == ScheduleType.DEPARTMENT) {
            // 팀 일정은 사용자가 속한 팀의 모든 일정
            schedules = scheduleRepository.findByDepartment_IdAndScheduleTypeAndStartTimeBetween(
                    finalDepartmentId, type, startDateTime, endDateTime);
        } else {
            // 개인 일정 조회 (PERSONAL)
            schedules = scheduleRepository.findByUserIdAndScheduleTypeBetweenWithUser(
                    userId, type, startDateTime, endDateTime);
        }

        // 일관성 있는 매퍼 사용
        return scheduleMapper.toResponseList(schedules);
    }


    //일정 수정
    @Transactional
    public ScheduleResponse updateSchedule(ScheduleRequest request, Long scheduleId, Long userId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 일정입니다.")
        );

        if (!schedule.getUser().getId().equals(userId)) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        // request dto로부터 받은 정보를 entity에 적용
        scheduleMapper.updateEntityFromRequest(schedule, request, null);

        // 슈뢰딩거 고양이기 때문에 post 업데이트 따로 처리하도록 하자.
        Post post = request.getPostId() != null
                ? postRepository.findById(request.getPostId()).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 게시글입니다."))
                : null;
        schedule.setPost(post);
        return scheduleMapper.toResponse(schedule);
    }


    //일정 삭제
    @Transactional
    public void deleteSchedule(Long scheduleId, Long userId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 일정입니다.")
        );
        if (!schedule.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }
        scheduleRepository.deleteById(scheduleId);
    }


// ===================== 관리자 전용 ============================

    // 관리자 회사 일정 생성
    @Transactional
    public ScheduleResponse createCompanySchedule(ScheduleRequest request, Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        //기본적으로 post를 null로 설정.
        Post post = null;
        if (postId != null) {
            post = postRepository.findById(postId).orElseThrow(
                    () -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        }

        Schedule schedule = scheduleMapper.toEntity(request, user, post);
        schedule.setScheduleType(ScheduleType.COMPANY);
        Schedule saved = scheduleRepository.save(schedule);
        return scheduleMapper.toResponse(saved);
    }

    // 관리자 부서 일정 생성
    @Transactional
    public ScheduleResponse createDepartmentSchedule(ScheduleRequest request, Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저입니다."));

        //기본적으로 post를 null로 설정.
        Post post = null;
        if (postId != null) {
            post = postRepository.findById(postId).orElseThrow(
                    () -> new IllegalArgumentException("존재하지 않는 게시글입니다."));
        }

        Long departmentId = request.getDepartmentId();
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow((() -> new ApiException(ErrorCode.DEPARTMENT_NOT_FOUND)));

        Schedule schedule = scheduleMapper.toEntity(request, user, post, department);
        schedule.setScheduleType(ScheduleType.DEPARTMENT);

        Schedule saved = scheduleRepository.save(schedule);
        return scheduleMapper.toResponse(saved);
    }

    // 관리자용 일정 수정 메서드
    @Transactional
    public ScheduleResponse updateAnySchedule(ScheduleRequest request, Long scheduleId, Long userId) {
        Schedule schedule = scheduleRepository.findById(scheduleId).orElseThrow(
                () -> new ApiException(ErrorCode.SCHEDULE_NOT_FOUND));

        if (!userId.equals(schedule.getUser().getId())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        // 부서 쪽 타입으로 변경할 경우
        Department department = null;
        if (request.getScheduleType() == ScheduleType.DEPARTMENT) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ApiException(ErrorCode.DEPARTMENT_NOT_FOUND));
        }
        scheduleMapper.updateEntityFromRequest(schedule, request, department);

        // 슈뢰딩거 고양이기 때문에 post 업데이트 따로 처리하도록 하자.
        Post post = request.getPostId() != null
                ? postRepository.findById(request.getPostId()).orElseThrow(
                () -> new ApiException(ErrorCode.POST_NOT_FOUND))
                : null;
        schedule.setPost(post);
        schedule.setScheduleStatus(request.getScheduleStatus());

        return scheduleMapper.toResponse(schedule);
    }
}

