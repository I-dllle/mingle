package com.example.mingle.domain.attendance.util;

import com.example.mingle.domain.attendance.dto.AttendanceDetailDto;
import com.example.mingle.domain.attendance.dto.AttendanceRecordDto;
import com.example.mingle.domain.attendance.dto.response.WorkHoursChartResponseDto;
import com.example.mingle.domain.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.enums.LeaveType;
import com.example.mingle.domain.attendance.enums.VacationType;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceRecordDto toRecordDto(Attendance attendance) {
        return AttendanceRecordDto.builder()
                .userId(attendance.getUser().getId())
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .overtimeStart(attendance.getOvertimeStart())
                .overtimeEnd(attendance.getOvertimeEnd())
                .workingHours(attendance.getWorkingHours())
                .overtimeHours(attendance.getOvertimeHours())
                .attendanceStatus(attendance.getAttendanceStatus())
                .halfDayType(attendance.getHalfDayType())
                .build();
    }

    public AttendanceDetailDto toDetailDto(Attendance attendance) {
        return AttendanceDetailDto.builder()
                .id(attendance.getId())
                .userId(attendance.getUser().getId())
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .attendanceStatus(attendance.getAttendanceStatus())
                .overtimeStart(attendance.getOvertimeStart())
                .overtimeEnd(attendance.getOvertimeEnd())
                .overtimeHours(attendance.getOvertimeHours())
                .workingHours(attendance.getWorkingHours())
                .halfDayType(attendance.getHalfDayType())
                .vacationType(attendance.getVacationType())
                .reason(attendance.getReason())
                .build();
    }

    public WorkHoursChartResponseDto toChartDto(Attendance attendance) {
        return WorkHoursChartResponseDto.builder()
                .date(attendance.getDate())
                .workingHours(attendance.getWorkingHours())
                .build();
    }

    public VacationType convertToVacationType(LeaveType leaveType) {
        return switch (leaveType) {
            case ANNUAL -> VacationType.ANNUAL;
            case SICK -> VacationType.SICK;
            case OFFICIAL -> VacationType.OFFICIAL;
            case MARRIAGE -> VacationType.MARRIAGE;
            case BEREAVEMENT -> VacationType.BEREAVEMENT;
            case PARENTAL -> VacationType.PARENTAL;
            case OTHER -> VacationType.OTHER;
            default -> VacationType.OTHER; // 기본값
        };
    }
}