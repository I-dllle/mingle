package com.example.mingle.domain.attendance.enums;

public enum HalfDayType {
    AM("오전"),
    PM("오후");

    private final String displayName;

    HalfDayType(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}