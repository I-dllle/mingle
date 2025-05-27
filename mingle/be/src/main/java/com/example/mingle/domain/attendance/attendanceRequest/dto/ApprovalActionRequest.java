package com.example.mingle.domain.attendance.attendanceRequest.dto;

import com.example.mingle.domain.attendance.enums.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalActionRequest {
    private String comment;
    private ApprovalStatus approvalStatus;
}
