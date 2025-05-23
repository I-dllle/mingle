package com.example.mingle.domain.attendance.dto.response;

import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.enums.HalfDayType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckInAndOutResponseDto {
    private Long userId;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private LocalDate date;
    private AttendanceStatus attendanceStatus;
    private Double workingHours;
    private HalfDayType halfDayType;

}
