package com.example.mingle.domain.attendance.util;

import com.example.mingle.domain.attendance.attendance.dto.AttendanceDetailDto;
import com.example.mingle.domain.attendance.attendance.dto.AttendanceRecordDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendanceAdminDto;
import com.example.mingle.domain.attendance.attendance.dto.response.WorkHoursChartResponseDto;
import com.example.mingle.domain.attendance.attendance.entity.Attendance;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDetailDto;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceSummaryDto;
import com.example.mingle.domain.attendance.attendanceRequest.entity.AttendanceRequest;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.List;

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
                .reason(attendance.getReason())
                .build();
    }

    public WorkHoursChartResponseDto toChartDto(Attendance attendance) {
        return WorkHoursChartResponseDto.builder()
                .date(attendance.getDate())
                .workingHours(attendance.getWorkingHours())
                .build();
    }

    public AttendanceRequestDetailDto toDetailDto(AttendanceRequest attendanceRequest) {

        List<AttendanceSummaryDto> summary = attendanceRequest.getAttendances().stream()
                .map(attendance -> AttendanceSummaryDto.builder()
                        .id(attendance.getId())
                        .date(attendance.getDate())
                        .status(attendance.getAttendanceStatus())
                        .userId(attendance.getUser().getId())
                        .build())
                .toList();

        return AttendanceRequestDetailDto.builder()
                .userId(attendanceRequest.getUser().getId())
                .leaveType(attendanceRequest.getLeaveType())
                .startDate(attendanceRequest.getStartDate())
                .endDate(attendanceRequest.getEndDate())
                .startTime(attendanceRequest.getStartTime())
                .endTime(attendanceRequest.getEndTime())
                .reason(attendanceRequest.getReason())
                .approvalStatus(attendanceRequest.getApprovalStatus())
                .approvalComment(attendanceRequest.getApprovalComment())
                .approverId(attendanceRequest.getApprover() != null ? attendanceRequest.getApprover().getId() : null)
                .appliedAt(attendanceRequest.getAppliedAt())
                .approvedAt(attendanceRequest.getApprovedAt())
                .attendances(summary)
                .leaveType(attendanceRequest.getLeaveType())
                .build();
    }

    public AttendanceAdminDto toAdminDto(Attendance attendance) {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

        String nickName = attendance.getUser() != null
                ? attendance.getUser().getNickname()
                : "알 수 없음";

        String departmentName = (attendance.getUser() != null && attendance.getUser().getDepartment() != null)
                ? attendance.getUser().getDepartment().getDepartmentName()
                : "미지정";

        String checkIn = attendance.getCheckInTime() != null
                ? attendance.getCheckInTime().toLocalTime().format(timeFormatter)
                : null;

        String checkOut = attendance.getCheckOutTime() != null
                ? attendance.getCheckOutTime().toLocalTime().format(timeFormatter)
                : null;


        return AttendanceAdminDto.builder()
                .id(attendance.getId())
                .date(attendance.getDate())
                .nickName(nickName)
                .departmentName(departmentName)
                .attendanceStatus(attendance.getAttendanceStatus())
                .checkIn(checkIn)
                .checkOut(checkOut)
                .build();
    }

}