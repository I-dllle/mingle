package com.example.mingle.domain.user.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {
    ACTIVE,     // 정상
    INACTIVE,   // 탈퇴 또는 중지 상태
    BANNED      // 제재 상태
}
