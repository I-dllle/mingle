package com.example.mingle.domain.reservation.room.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoomType {
    MEETING_ROOM("회의실"),
    PRACTICE_ROOM("연습실");

    private final String displayName;


}
