package com.example.mingle.domain.attendance.util;

import com.example.mingle.domain.attendance.dto.response.CheckInAndOutResponseDto;
import com.example.mingle.domain.attendance.entity.Attendance;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public CheckInAndOutResponseDto checkInAndOutResponseHelper(Attendance attendance) {
        return CheckInAndOutResponseDto.builder()
                .userId(attendance.getUser().getId())
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .attendanceStatus(attendance.getAttendanceStatus())
                .halfDayType(attendance.getHalfDayType())
                .build();
    }

}
