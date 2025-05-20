package com.example.mingle.domain.attendance.attendance.service;

import com.example.mingle.domain.attendance.attendance.dto.AttendanceDetailDto;
import com.example.mingle.domain.attendance.attendance.dto.AttendanceRecordDto;
import com.example.mingle.domain.attendance.attendance.dto.request.OvertimeRequestDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendanceAdminDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendanceMonthStatsDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendancePageResponseDto;
import com.example.mingle.domain.attendance.attendance.dto.response.WorkHoursChartResponseDto;
import com.example.mingle.domain.attendance.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.attendance.repository.AttendanceRepository;
import com.example.mingle.domain.attendance.util.AttendanceMapper;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
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


    // 출근 가능한 상태인지 확인 (오전 반차는 출근 불가, 오후 반차는 오전에 출근)
    private boolean canCheckIn(AttendanceStatus status, LocalDateTime now) {
        LocalTime currentTime = now.toLocalTime();
        boolean isAfternoon = currentTime.isAfter(LocalTime.of(12, 0)); // 정오(12시) 이후는 오후로 간주

        return switch (status) {
            case ON_HALF_DAY_AM -> isAfternoon; // 오전 반차는 오후에만 출근 가능
            case ON_HALF_DAY_PM -> !isAfternoon; // 오후 반차는 오전에만 출근 가능
            case ON_BUSINESS_TRIP -> true; // 출장은 시간 관계없이 출근 가능
            case ON_ANNUAL_LEAVE, ON_SICK_LEAVE, ON_OFFICIAL_LEAVE, ON_SPECIAL_LEAVE -> false; // 전일 휴가는 출근 불가
            default -> true; // 그 외 상태는 출근 가능
        };
    }


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

        // 이미 18시가 넘었으면 예외처리
        if (now.toLocalTime().isAfter(LocalTime.of(18, 0))) {
            throw new IllegalStateException("출근 시간이 지났습니다");
        }

        // 이미 일반 출근 처리된 경우 예외 발생
        if (attendance.getCheckInTime() != null &&
                (attendance.getAttendanceStatus() == AttendanceStatus.PRESENT ||
                        attendance.getAttendanceStatus() == AttendanceStatus.LATE)) {
            throw new IllegalStateException("이미 출근 처리되었습니다.");
        }

        // 오전 반차인 경우, 출근 시간만 업데이트 (상태는 유지)
        if (attendance.getAttendanceStatus() != null) {
            AttendanceStatus status = attendance.getAttendanceStatus();

            // 시간을 고려하여 출근 가능한지 확인
            if (canCheckIn(status, now)) {
                attendance.setCheckInTime(now);

                boolean isAfternoon = now.toLocalTime().isAfter(LocalTime.of(12, 0));

                // 오전 반차이고 오후에 출근하는 경우
                if (status == AttendanceStatus.ON_HALF_DAY_AM && isAfternoon) {
                    // 상태 유지, 출근 시간만 기록
                    log.info("오전 반차 사용자 {} 오후 출근 처리", userId);
                }
                // 오후 반차이고 오전에 출근하는 경우
                else if (status == AttendanceStatus.ON_HALF_DAY_PM && !isAfternoon) {
                    // 상태 유지, 출근 시간만 기록
                    log.info("오후 반차 사용자 {} 오전 출근 처리", userId);
                }
            } else {
                throw new IllegalStateException("현재 상태에서 출근할 수 없습니다. " + status.getDisplayName());
            }
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
        // 점심시간 제외 (기본 1시간)
        workingHours = Math.max(0, workingHours - 1.0);  // 음수 방지
        attendance.setWorkingHours(workingHours);

        // 야근 자동 감지 및 처리
        if (now.isAfter(overtimeThreshold)) {
            // 상태가 오후 반차인 경우는 야근 처리하지 않음
            if (attendance.getAttendanceStatus() != AttendanceStatus.ON_HALF_DAY_PM) {
                attendance.setAttendanceStatus(AttendanceStatus.OVERTIME);

                attendance.setOvertimeStart(standardEndTime);
                attendance.setOvertimeEnd(now);

                // 야근 시간 계산 (표준 퇴근 시간부터 실제 퇴근 시간까지)
                double overtimeHours = Duration.between(standardEndTime, now).toMinutes() / 60.0;
                attendance.setOvertimeHours(overtimeHours);
            }
        }
        attendanceRepository.save(attendance);
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
        // 저장
        if (!toUpdate.isEmpty()) {
            attendanceRepository.saveAll(toUpdate);
            log.info("{}일 결근 상태 업데이트: {} 건", yesterday, toUpdate.size());
        }
        if (!toCreate.isEmpty()) {
            attendanceRepository.saveAll(toCreate);
            log.info("{}일 결근 상태 생성: {} 건", yesterday, toCreate.size());
        }
        log.info("{}일의 결근자 처리를 완료했습니다.", yesterday);
    }


    //주간, 월간 차트를 위한 서비스 메서드
    @Transactional(readOnly = true)
    public List<WorkHoursChartResponseDto> getChartData(Long userId, LocalDate start, LocalDate end) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("존재하지 않는 유저입니다. id=" + userId);
        }

        if (start.isAfter(end)) {
            throw new ApiException(ErrorCode.INVALID_TIME_RANGE);
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
        // 기간 계산
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // DB에서 상태별 카운트 조회
        List<Object[]> rawCounts = attendanceRepository
                .countStatusByUserAndDateBetween(userId, start, end);

        // 초기값 세팅 (모든 상태 0으로)
        Map<AttendanceStatus, Long> statusMap = new EnumMap<>(AttendanceStatus.class);
        for (AttendanceStatus s : AttendanceStatus.values()) {
            statusMap.put(s, 0L);
        }

        // 조회 결과 합치기
        for (Object[] row : rawCounts) {
            AttendanceStatus status = (AttendanceStatus) row[0];
            if (status != null) {
                Long cnt = (Long) row[1];
                statusMap.put(status, cnt);
            }
        }

        // 상태 합산 수 정의
        double vacationCount = statusMap.entrySet().stream()
                .mapToDouble(e -> {
                    switch (e.getKey()) {
                        case ON_HALF_DAY_AM, ON_HALF_DAY_PM:
                            return e.getValue() * 0.5;      // 반차는 0.5
                        case ON_ANNUAL_LEAVE, ON_SICK_LEAVE,
                             ON_OFFICIAL_LEAVE, ON_BUSINESS_TRIP,
                             ON_SPECIAL_LEAVE:
                            return e.getValue();            // 나머지 휴가는 1.0
                        default:
                            return 0.0;
                    }
                })
                .sum();
        int presentCount = statusMap.get(AttendanceStatus.PRESENT).intValue();
        int lateCount = statusMap.get(AttendanceStatus.LATE).intValue();
        int earlyLeaveCount = statusMap.get(AttendanceStatus.EARLY_LEAVE).intValue();
        int absentCount = statusMap.get(AttendanceStatus.ABSENT).intValue();

        // DTO 빌드
        return AttendanceMonthStatsDto.builder()
                .yearMonth(ym)
                .userId(userId)
                .presentCount(presentCount)
                .lateCount(lateCount)
                .earlyLeaveCount(earlyLeaveCount)
                .absentCount(absentCount)
                .vacationCount(vacationCount)
                .build();
    }


    // 야근 추후 보고 기능 구현
    @Transactional
    public AttendanceDetailDto reportOvertime(Long userId, OvertimeRequestDto requestDto) {

        userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        LocalDate date = requestDto.getDate();

        // 미래 날짜에 대한 야근 보고 제한
        if (date.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("미래 날짜에 대한 야근 보고는 불가능합니다.");
        }

        Attendance attendance = attendanceRepository.findByUser_IdAndDate(userId, date)
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜의 근태 기록이 없습니다."));

        if (attendance.getAttendanceStatus() != AttendanceStatus.OVERTIME) {
            throw new IllegalStateException("야근으로 기록된 날짜만 보고할 수 있습니다.");
        }

        if (attendance.getOvertimeHours() == null || attendance.getOvertimeHours() <= 0) {
            throw new IllegalStateException("야근 시간이 기록되지 않았습니다.");
        }

        // 사유 추가
        attendance.setReason(requestDto.getReason());
        Attendance saved = attendanceRepository.save(attendance);

        return attendanceMapper.toDetailDto(saved);
    }


    // ================== 관리자 용 메서드 =========================

    // 전체 근태 기록 조회(페이징 및 필터 검색)
    @Transactional(readOnly = true)
    public Page<AttendanceAdminDto> getFilteredAttendanceRecords(
            YearMonth ym,
            Long departmentId,
            Long userId,
            String keyword,
            AttendanceStatus status,
            Pageable pageable
    ) {
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        return attendanceRepository.findWithFilters(
                start, end, departmentId, userId, keyword, status, pageable
        ).map(attendanceMapper::toAdminDto);
    }

    // 개별 근태 상세 조회
    @Transactional(readOnly = true)
    public AttendanceDetailDto getAttendanceDetailByAdmin(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ApiException(ErrorCode.ATTENDANCE_NOT_FOUND));

        return attendanceMapper.toDetailDto(attendance);
    }

    // 개별 근태 수정
    @Transactional
    public AttendanceDetailDto updateAttendanceByAdmin(Long attendanceId, AttendanceDetailDto dto) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ApiException(ErrorCode.ATTENDANCE_NOT_FOUND));

        if (dto.getCheckInTime() != null) {
            attendance.setDate(dto.getCheckInTime().toLocalDate());
        } else {
            attendance.setDate(dto.getDate()); // fallback
        }

        attendance.setCheckInTime(dto.getCheckInTime());
        attendance.setCheckOutTime(dto.getCheckOutTime());
        attendance.setAttendanceStatus(dto.getAttendanceStatus());
        attendance.setReason(dto.getReason());

        // 근무 시간 자동 계산
        if (dto.getCheckInTime() != null && dto.getCheckOutTime() != null) {
            Duration workDuration = Duration.between(dto.getCheckInTime(), dto.getCheckOutTime());

            if (workDuration.isNegative()) {
                throw new ApiException(ErrorCode.INVALID_TIME_RANGE);
            }

            double workingHours = (double) Duration.between(dto.getCheckInTime(), dto.getCheckOutTime()).toMinutes() / 60.0;
            // 점심시간 제외 (기본 1시간)
            workingHours = Math.max(0, workingHours - 1.0);  // 음수 방지
            attendance.setWorkingHours(Math.round((workingHours) * 10000.0) / 10000.0);
        }

        // 야근 시간 자동 계산
        if (dto.getOvertimeStart() != null && dto.getOvertimeEnd() != null) {
            Duration workDuration = Duration.between(dto.getOvertimeStart(), dto.getOvertimeEnd());

            if (workDuration.isNegative()) {
                throw new ApiException(ErrorCode.INVALID_TIME_RANGE);
            }

            double overtimeHours = (double) Duration.between(dto.getOvertimeStart(), dto.getOvertimeEnd()).toMinutes() / 60.0;
            attendance.setOvertimeHours(Math.round(overtimeHours * 10000.0) / 10000.0);
            attendance.setOvertimeStart(dto.getOvertimeStart());
            attendance.setOvertimeEnd(dto.getOvertimeEnd());
        } else {
            attendance.setOvertimeStart(null);
            attendance.setOvertimeEnd(null);
            attendance.setOvertimeHours(0.0);
        }
        return attendanceMapper.toDetailDto(attendance);
    }
}



