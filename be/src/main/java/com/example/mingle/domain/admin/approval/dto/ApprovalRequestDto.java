package com.example.mingle.domain.admin.approval.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApprovalRequestDto {
    private String comment; // 승인 또는 반려 사유 입력란
}