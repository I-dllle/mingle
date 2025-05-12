package com.example.mingle.domain.user.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserStatus {
    //활동중, 자리비움, 오프라인
    ONLINE,
    OFFLINE,
    LEFT
}
