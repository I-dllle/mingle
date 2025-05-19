package com.example.mingle.domain.reservation.room.entity;

public enum RoomType {
    MEETING_ROOM("회의실"),
    PRACTICE_ROOM("연습실");

    private final String displayName;

    RoomType(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
