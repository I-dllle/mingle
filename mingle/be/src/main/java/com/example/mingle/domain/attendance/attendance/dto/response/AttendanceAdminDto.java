package com.example.mingle.domain.attendance.attendance.dto.response;

import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceAdminDto {
    private Long id;
    private LocalDate date;
    private String nickName;
    private String departmentName;
    private AttendanceStatus attendanceStatus;
    private String checkIn;  // "09:00"
    private String checkOut; // "18:00"
}
