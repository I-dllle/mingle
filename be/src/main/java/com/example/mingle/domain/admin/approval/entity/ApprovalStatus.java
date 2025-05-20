package com.example.mingle.domain.admin.approval.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApprovalStatus {
    PENDING("대기"),
    APPROVED("승인"),
    REJECTED("반려");

    private final String displayName;

}