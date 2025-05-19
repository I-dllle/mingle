package com.example.mingle.domain.attendance.attendance.dto.response;

import lombok.*;

import java.time.YearMonth;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendanceMonthStatsDto {
    private YearMonth yearMonth;
    private Long userId;
    private int presentCount;     // 정상 출근 일수
    private int lateCount;        // 지각 일수
    private int earlyLeaveCount;  // 조퇴 일수
    private int absentCount;      // 결근 일수
    private double vacationCount;    // 휴가 일수
    private int businessTripCount; // 출장 일수
}
