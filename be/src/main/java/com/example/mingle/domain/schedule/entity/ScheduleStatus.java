package com.example.mingle.domain.schedule.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScheduleStatus {
    IMPORTANT_MEETING("중요회의"),
    BUSINESS_TRIP("출장"),
    COMPLETED("일정완료"),
    CANCELED("일정취소"),
    VACATION("휴가");

    private final String displayName;

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static ScheduleStatus fromDisplayName(String displayName) {
        for (ScheduleStatus status : values()) {
            if (status.displayName.equals(displayName)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown displayName: " + displayName);
    }
}
