package com.example.mingle.domain.user.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    ARTIST,
    MANAGER,
    STAFF,
    ADMIN
}
