package com.example.mingle.domain.reservation.room.entity;

import com.example.mingle.domain.admin.approval.entity.ApprovalStatus;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RoomType {
    MEETING_ROOM("회의실"),
    PRACTICE_ROOM("연습실");

    private final String displayName;

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static RoomType fromDisplayName(String displayName) {
        for (RoomType status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown displayName: " + displayName);
    }

}
