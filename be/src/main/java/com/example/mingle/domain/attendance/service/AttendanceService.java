package com.example.mingle.domain.attendance.service;

import com.example.mingle.domain.attendance.dto.request.OvertimeRequestDto;
import com.example.mingle.domain.attendance.dto.response.CheckInAndOutResponseDto;
import com.example.mingle.domain.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.enums.HalfDayType;
import com.example.mingle.domain.attendance.repository.AttendanceRepository;
import com.example.mingle.domain.attendance.util.AttendanceMapper;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
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
    private static final double EARLY_LEAVE_THRESHOLD_HOURS = 7.5; // 조퇴 기준 시간 (7시간 30분)


    //출근 신청
    @Transactional
    public CheckInAndOutResponseDto checkIn(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        // 해당 날짜의 근태 기록 찾기 (없으면 새 객체 생성)
        Attendance attendance = attendanceRepository
                .findByUserIdAndDate(userId, today)
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
        if (attendance.getId() == null) {
            attendanceRepository.save(attendance);
        }

        return attendanceMapper.checkInAndOutResponseHelper(attendance);
    }

    //퇴근
    @Transactional
    public CheckInAndOutResponseDto checkOut(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByUserIdAndDate(userId, today)
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

        // 조퇴 처리 (6시간 미만 근무 && 반차가 아닌 경우)
        else if (workingHours < EARLY_LEAVE_THRESHOLD_HOURS && attendance.getAttendanceStatus() != AttendanceStatus.HALF_DAY) {
            attendance.setAttendanceStatus(AttendanceStatus.EARLY_LEAVE);
        }

        return attendanceMapper.checkInAndOutResponseHelper(attendance);
    }

    //야근 보고서
    @Transactional
    public CheckInAndOutResponseDto submitOvertimeReport(Long userId, OvertimeRequestDto reportDto) {
        // 본인 인증
        User user = userRepository.findById(userId).orElseThrow(
                () -> new IllegalArgumentException("존재하지 않는 유저입니다.")
        );

        // 야근 기록 조회
        Attendance attendance = attendanceRepository.findById(reportDto.getAttendanceId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 근태 기록입니다."));

        // 본인의 근태 기록인지 확인
        if (!attendance.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("본인의 근태 기록만 수정할 수 있습니다.");
        }

        // 야근 기록이 있는지 확인
        if (attendance.getAttendanceStatus() != AttendanceStatus.OVERTIME ||
                attendance.getOvertimeHours() == null ||
                attendance.getOvertimeHours() <= 0) {
            throw new IllegalStateException("야근 기록이 없는 근태입니다.");
        }

        // 야근 사유 저장
        attendance.setReason(reportDto.getReason());

        return attendanceMapper.checkInAndOutResponseHelper(attendance);
    }
}


