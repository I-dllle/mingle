package com.example.mingle.domain.attendance.dto.response;

import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.attendance.enums.HalfDayType;
import com.example.mingle.domain.attendance.enums.VacationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceSummaryDto {
    private LocalDate date;
    private Double workingHours;
    private Double overtimeHours;
    private AttendanceStatus attendanceStatus;
    private HalfDayType halfDayType;
    private VacationType vacationType;
}
