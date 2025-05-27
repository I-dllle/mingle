package com.example.mingle.domain.attendance.attendanceRequest.dto;

import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class AttendanceSummaryDto {
    private Long id;
    private Long userId;
    private LocalDate date;
    private AttendanceStatus status;
}
