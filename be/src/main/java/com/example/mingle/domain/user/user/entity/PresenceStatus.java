package com.example.mingle.domain.user.user.entity;

public enum PresenceStatus {
    ONLINE,         // 현재 활동 중
    AWAY,           // 일정 시간 이상 무입력 (자리비움)
    DO_NOT_DISTURB, // 사용자가 직접 설정
    OFFLINE         // 로그아웃 상태
}
