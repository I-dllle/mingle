package com.example.mingle.domain.user.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {
    ACTIVE,     // 정상
    INACTIVE
}
