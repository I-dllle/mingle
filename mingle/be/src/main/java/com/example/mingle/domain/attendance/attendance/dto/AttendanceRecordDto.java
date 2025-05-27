package com.example.mingle.domain.attendance.attendance.dto;

import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendanceRecordDto {
    private Long userId;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private LocalDateTime overtimeStart;
    private LocalDateTime overtimeEnd;
    private LocalDate date;
    private AttendanceStatus attendanceStatus;
    private Double workingHours;
    private Double overtimeHours;
}
