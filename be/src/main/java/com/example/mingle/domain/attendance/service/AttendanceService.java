package com.example.mingle.domain.attendance.service;

import com.example.mingle.domain.attendance.dto.AttendanceDetailDto;
import com.example.mingle.domain.attendance.dto.AttendanceRecordDto;
import com.example.mingle.domain.attendance.dto.request.LeaveRequestDto;
import com.example.mingle.domain.attendance.dto.request.OvertimeRequestDto;
import com.example.mingle.domain.attendance.dto.response.AttendanceMonthStatsDto;
import com.example.mingle.domain.attendance.dto.response.AttendancePageResponseDto;
import com.example.mingle.domain.attendance.dto.response.WorkHoursChartResponseDto;
import com.example.mingle.domain.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.enums.HalfDayType;
import com.example.mingle.domain.attendance.enums.LeaveType;
import com.example.mingle.domain.attendance.enums.VacationType;
import com.example.mingle.domain.attendance.repository.AttendanceRepository;
import com.example.mingle.domain.attendance.util.AttendanceMapper;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final AttendanceMapper attendanceMapper;

    // 근태 관련 상수 정의
    private static final int STANDARD_START_HOUR = 9;   // 출근 기준 - 오전 9시
    private static final int STANDARD_START_MINUTE = 0; // 출근 기준 - 0분
    private static final int STANDARD_END_HOUR = 18;    // 퇴근 기준 - 오후 6시
    private static final int STANDARD_END_MINUTE = 0;   // 퇴근 기준 - 0분
    private static final int OVERTIME_THRESHOLD_MINUTES = 10; // 야근 허용 유예 시간 (10분)


    //출근 신청
    @Transactional
    public AttendanceRecordDto checkIn(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        // 해당 날짜의 근태 기록 찾기 (없으면 새 객체 생성)
        Attendance attendance = attendanceRepository
                .findByUser_IdAndDate(userId, today)
                .orElseGet(() -> Attendance.builder()
                        .user(user)
                        .date(today)
                        .build());


        // 이미 일반 출근 처리된 경우 예외 발생
        if (attendance.getCheckInTime() != null &&
                (attendance.getAttendanceStatus() == AttendanceStatus.PRESENT ||
                        attendance.getAttendanceStatus() == AttendanceStatus.LATE)) {
            throw new IllegalStateException("이미 출근 처리되었습니다.");
        }

        // 오전 반차인 경우, 출근 시간만 업데이트 (상태는 유지)
        if (attendance.getAttendanceStatus() == AttendanceStatus.HALF_DAY &&
                attendance.getHalfDayType() == HalfDayType.AM) {
            attendance.setCheckInTime(now);
        } else {
            attendance.setCheckInTime(now);

            // 9시 이후 출근은 지각 처리
            LocalDateTime standardCheckInTime = today.atTime(STANDARD_START_HOUR, STANDARD_START_MINUTE);
            attendance.setAttendanceStatus(now.isAfter(standardCheckInTime) ?
                    AttendanceStatus.LATE : AttendanceStatus.PRESENT);
        }

        //업데이트
        attendanceRepository.save(attendance);


        return attendanceMapper.toRecordDto(attendance);
    }

    //퇴근 신청
    @Transactional
    public AttendanceRecordDto checkOut(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByUser_IdAndDate(userId, today)
                .orElseThrow(() -> new IllegalArgumentException("오늘의 출근 기록이 없습니다."));

        if (attendance.getCheckInTime() == null) {
            throw new IllegalStateException("출근 처리가 되지 않았습니다.");
        }

        if (attendance.getCheckOutTime() != null) {
            throw new IllegalStateException("이미 퇴근 처리되었습니다.");
        }

        // 표준 퇴근 시간 설정 (18:00)
        LocalDateTime standardEndTime = today.atTime(STANDARD_END_HOUR, STANDARD_END_MINUTE);

        // 야근 기준 시간 (18:10) - 10분 유예
        LocalDateTime overtimeThreshold = standardEndTime.plusMinutes(OVERTIME_THRESHOLD_MINUTES);


        attendance.setCheckOutTime(now);
        double workingHours = Duration.between(attendance.getCheckInTime(), now).toMinutes() / 60.0;
        attendance.setWorkingHours(workingHours);

        // 야근 자동 감지 및 처리
        if (now.isAfter(overtimeThreshold)) {
            // 퇴근 시간이 야근 기준 시간을 초과하면 야근으로 처리
            attendance.setAttendanceStatus(AttendanceStatus.OVERTIME);

            // 야근 시작 시간 설정 (표준 퇴근 시간)
            attendance.setOvertimeStart(standardEndTime);

            // 야근 종료 시간 설정 (실제 퇴근 시간)
            attendance.setOvertimeEnd(now);

            // 야근 시간 계산 (표준 퇴근 시간부터 실제 퇴근 시간까지)
            double overtimeHours = Duration.between(standardEndTime, now).toMinutes() / 60.0;
            attendance.setOvertimeHours(overtimeHours);
        }
        return attendanceMapper.toRecordDto(attendance);
    }

    //일별 근태 기록 조회
    @Transactional(readOnly = true)
    public AttendanceDetailDto getDailyAttendance(Long userId, LocalDate date) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("존재하지 않는 유저입니다.");
        }

        Attendance attendance = attendanceRepository
                .findByUser_IdAndDate(userId, date)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜의 근태 기록이 없습니다."));

        return attendanceMapper.toDetailDto(attendance);
    }

    // 최근 근태 기록 페이지네이션 조회
    @Transactional(readOnly = true)
    public AttendancePageResponseDto getRecentRecords(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());

        Page<Attendance> attendancePage
                = attendanceRepository.findByUser_IdOrderByDateDesc(userId, pageable);

        List<AttendanceRecordDto> content = attendancePage.getContent().stream()
                .map(attendanceMapper::toRecordDto)
                .collect(Collectors.toList());


        return AttendancePageResponseDto.builder()
                .content(content)
                .pageNumber(attendancePage.getNumber() + 1)
                .pageSize(attendancePage.getSize())
                .totalElements(attendancePage.getTotalElements())
                .totalPages(attendancePage.getTotalPages())
                .last(attendancePage.isLast())
                .build();
    }

    //주간, 월간 차트를 위한 서비스 메서드
    @Transactional(readOnly = true)
    public List<WorkHoursChartResponseDto> getChartData(Long userId, LocalDate start, LocalDate end) {
        // 유저 존재 확인(optional)
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("존재하지 않는 유저입니다. id=" + userId);
        }

        // 기간별 근태 조회
        List<Attendance> records = attendanceRepository
                .findByUser_IdAndDateBetweenOrderByDateAsc(userId, start, end);

        // 차트용 DTO로 매핑
        return records.stream()
                .map(attendanceMapper::toChartDto)
                .toList();
    }

    //월간 상태 카드를 위한 메서드
    @Transactional(readOnly = true)
    public AttendanceMonthStatsDto getMonthlyStatistics(Long userId, YearMonth ym) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("존재하지 않는 유저입니다. id=" + userId);
        }

        // 1) 기간 계산
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // 2) DB에서 상태별 카운트 조회
        List<Object[]> rawCounts = attendanceRepository
                .countStatusByUserAndDateBetween(userId, start, end);

        // 3) 초기값 세팅
        Map<AttendanceStatus, Long> statusMap = new EnumMap<>(AttendanceStatus.class);
        for (AttendanceStatus s : AttendanceStatus.values()) {
            statusMap.put(s, 0L);
        }

        // 4) 조회 결과 머지
        for (Object[] row : rawCounts) {
            AttendanceStatus status = (AttendanceStatus) row[0];
            if (status != null) {  // null 체크 추가
                Long cnt = (Long) row[1];
                statusMap.put(status, cnt);
            }
        }

        // 5) DTO 빌드
        return AttendanceMonthStatsDto.builder()
                .yearMonth(ym)
                .userId(userId)
                .presentCount(statusMap.get(AttendanceStatus.PRESENT).intValue())
                .lateCount(statusMap.get(AttendanceStatus.LATE).intValue())
                .earlyLeaveCount(statusMap.get(AttendanceStatus.EARLY_LEAVE).intValue())
                .absentCount(statusMap.get(AttendanceStatus.ABSENT).intValue())
                .vacationCount(statusMap.get(AttendanceStatus.VACATION).intValue())
                .build();
    }

    //연차·병가·반차·지각·조퇴 통합 신청
    @Transactional
    public List<AttendanceDetailDto> applyLeave(Long userId, LeaveRequestDto requestDto) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        //결과 담을 리스트 생성
        List<AttendanceDetailDto> resultList = new ArrayList<>();

        // 신청날짜 계산
        LocalDate startDate = requestDto.getStartDate();
        LocalDate endDate = requestDto.getEndDate() != null ? requestDto.getEndDate() : startDate;

        LocalDate today = LocalDate.now();
        if ((requestDto.getType() == LeaveType.HALF_DAY_AM ||
                requestDto.getType() == LeaveType.HALF_DAY_PM ||
                requestDto.getType() == LeaveType.EARLY_LEAVE) &&
                !startDate.equals(today)) {
            throw new IllegalArgumentException(
                    "반차, 조퇴는 당일에만 신청 가능합니다.");
        }


        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("시작일이 종료일보다 늦을 수 없습니다.");
        }

        //반차 신청 시 하루만 가능하도록 제한
        if ((requestDto.getType() == LeaveType.HALF_DAY_AM ||
                requestDto.getType() == LeaveType.HALF_DAY_PM) &&
                !startDate.equals(endDate)) {
            throw new IllegalArgumentException("반차는 하루만 신청 가능합니다.");
        }

        //시작일부터 종료일까지 순회하며 각 날짜별로 처리
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            //주말 제외
            if (currentDate.getDayOfWeek() == DayOfWeek.SATURDAY ||
                    currentDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
                currentDate = currentDate.plusDays(1);
                continue;
            }

            // 해당 날짜의 근태 기록 조회 또는 생성
            LocalDate finalCurrentDate = currentDate;
            Attendance attendance = attendanceRepository
                    .findByUser_IdAndDate(user.getId(), currentDate)
                    .orElseGet(() -> Attendance.builder()
                            .user(user)
                            .date(finalCurrentDate)
                            .build());

            // 이미 출근 처리된 날짜인지 확인
            if (attendance.getCheckInTime() != null) {
                throw new IllegalStateException(
                        currentDate + " 날짜에는 이미 출근 처리되어 휴가를 신청할 수 없습니다.");
            }

            // 이미 휴가가 신청된 날짜인지 확인
            if (attendance.getAttendanceStatus() != null) {
                throw new IllegalStateException(
                        currentDate + " 날짜에는 이미 휴가/결근 등이 신청되어 있습니다.");
            }



            // 이미 출근 처리된 날짜인지 확인 (첫날만 체크하지 않고 모든 날짜 체크)
            if (attendance.getCheckInTime() != null) {
                throw new IllegalStateException(
                        currentDate + " 날짜에는 이미 출근 처리되어 휴가를 신청할 수 없습니다.");
            }

            // 휴가 유형에 따라 처리
            switch (requestDto.getType()) {
                case HALF_DAY_AM:
                    attendance.setAttendanceStatus(AttendanceStatus.HALF_DAY);
                    attendance.setHalfDayType(HalfDayType.AM);
                    break;

                case HALF_DAY_PM:
                    attendance.setAttendanceStatus(AttendanceStatus.HALF_DAY);
                    attendance.setHalfDayType(HalfDayType.PM);
                    attendance.setWorkingHours(4.0);
                    break;


                case ANNUAL:
                case SICK:
                case OFFICIAL:
                case MARRIAGE:
                case BEREAVEMENT:
                case PARENTAL:
                case OTHER:
                    attendance.setAttendanceStatus(AttendanceStatus.VACATION);
                    // LeaveType을 VacationType으로 변환
                    VacationType vacationType = attendanceMapper.convertToVacationType(requestDto.getType());
                    attendance.setVacationType(vacationType);
                    attendance.setWorkingHours(0.0); // 휴가는 근무시간 0
                    break;

                case LATE:
                    attendance.setAttendanceStatus(AttendanceStatus.LATE);
                    if (requestDto.getStartTime() != null) {
                        attendance.setCheckInTime(LocalDateTime.of(currentDate, requestDto.getStartTime()));
                    }
                    break;

                case EARLY_LEAVE:
                    attendance.setAttendanceStatus(AttendanceStatus.EARLY_LEAVE);
                    if (requestDto.getEndTime() != null) {
                        attendance.setCheckOutTime(LocalDateTime.of(currentDate, requestDto.getEndTime()));
                    }
                    break;

                case BUSINESS_TRIP:
                    attendance.setAttendanceStatus(AttendanceStatus.BUSINESS_TRIP);
                    attendance.setWorkingHours(8.0); // 출장은 일반적으로 하루 근무로 간주
                    break;

                case ABSENT:
                    attendance.setAttendanceStatus(AttendanceStatus.ABSENT);
                    attendance.setWorkingHours(0.0); // 결근은 근무시간 0
                    break;

                default:
                    throw new IllegalArgumentException("지원되지 않는 휴가 유형입니다.");
            }

            // 사유 설정
            attendance.setReason(requestDto.getReason());

            // 저장
            Attendance savedAttendance = attendanceRepository.save(attendance);

            // 결과 리스트에 추가
            resultList.add(attendanceMapper.toDetailDto(savedAttendance));

            // 다음 날짜로
            currentDate = currentDate.plusDays(1);
        }

        return resultList;
    }

    // 야근 추후 보고 기능 구현
    @Transactional
    public AttendanceDetailDto reportOvertime(Long userId, OvertimeRequestDto requestDto) {

        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        LocalDate date = requestDto.getDate();

        // 미래 날짜에 대한 야근 보고 제한
        if (date.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("미래 날짜에 대한 야근 보고는 불가능합니다.");
        }

        Attendance attendance = attendanceRepository.findByUser_IdAndDate(userId, date)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜의 근태 기록이 없습니다."));

        if (attendance.getCheckInTime() == null &&
                attendance.getAttendanceStatus() == null) {
            throw new IllegalStateException("해당 날짜에 야근이 자동 감지되지 않았습니다.");
        }
        attendance.setReason(requestDto.getReason());

        Attendance saved = attendanceRepository.save(attendance);

        return attendanceMapper.toDetailDto(saved);

    }


    //자동 결근 상태 만들기
    @Scheduled(cron = "0 5 0 * * ?", zone = "Asia/Seoul") // 매일 00시 05분에 실행
    @Transactional
    public void processAbsentees() {
        // 전날 날짜 계산
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // 주말이면 처리하지 않음
        if (yesterday.getDayOfWeek() == DayOfWeek.SATURDAY ||
                yesterday.getDayOfWeek() == DayOfWeek.SUNDAY) {
            log.info("주말({})은 결근 처리를 하지 않습니다.", yesterday);
            return;
        }

        log.info("{}일의 결근자 처리를 시작합니다.", yesterday);

        // 모든 사용자 조회
        List<User> activeUsers = userRepository.findAll();
        List<Attendance> toUpdate = new ArrayList<>();
        List<Attendance> toCreate = new ArrayList<>();


        for (User user : activeUsers) {
            attendanceRepository.findByUser_IdAndDate(user.getId(), yesterday)
                    .ifPresentOrElse(
                            attendance -> {
                                if (attendance.getCheckInTime() == null &&
                                        attendance.getAttendanceStatus() == null) {
                                    attendance.setAttendanceStatus(AttendanceStatus.ABSENT);
                                    attendance.setWorkingHours(0.0);
                                    toUpdate.add(attendance);
                                }
                            },
                            () -> {
                                Attendance absentRecord = Attendance.builder()
                                        .user(user)
                                        .date(yesterday)
                                        .attendanceStatus(AttendanceStatus.ABSENT)
                                        .workingHours(0.0)
                                        .reason("미출근 자동 결근 처리")
                                        .build();
                                toCreate.add(absentRecord);
                            }
                    );
        }
        attendanceRepository.saveAll(toUpdate);
        attendanceRepository.saveAll(toCreate);
        log.info("{}일의 결근자 처리를 완료했습니다.", yesterday);
    }
}



