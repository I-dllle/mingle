package com.example.mingle.domain.attendance.attendance.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceExcelDto {
    private String name;
    private String nickName;
    private String departmentName;
    private String date;              // "2024-05-01"
    private String checkIn;           // "09:01"
    private String checkOut;          // "18:05"
    private String AttendanceStatus;  // "정상 출근", "지각", "결근" 등으로 가공
    private String LeaveReason;       // 특별 휴가 시 어떤 사유인지 표시
}
