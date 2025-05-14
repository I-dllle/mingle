package com.example.mingle.domain.attendance.enums;

public enum VacationType {
    ANNUAL("연차"),
    SICK("병가"),
    OFFICIAL("공가"),
    MARRIAGE("결혼 휴가"),
    BEREAVEMENT("조의 휴가"),
    PARENTAL("육아 휴가"),
    OTHER("기타");

    private final String displayName;

    VacationType(String displayName) {
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
