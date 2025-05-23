package com.example.mingle.domain.user.user.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PresenceStatus {
    ONLINE("활동 중", "green"),
    AWAY("자리비움", "yellow"),
    DO_NOT_DISTURB("방해금지", "red"),
    OFFLINE("오프라인", "gray");

    private final String displayName; // 한글 이름
    private final String color;       // 프론트 뱃지용 색상
}
