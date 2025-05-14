package com.example.mingle.domain.attendance.enums;

public enum LeaveType {
    ANNUAL("연차"),
    LATE("지각"),
    ABSENT("결근"),
    HALF_DAY_AM("오전 반차"),
    HALF_DAY_PM("오후 반차"),
    EARLY_LEAVE("조퇴"),
    SICK("병가"),
    OFFICIAL("공가"),
    MARRIAGE("결혼 휴가"),
    BEREAVEMENT("조의 휴가"),
    PARENTAL("육아 휴가"),
    BUSINESS_TRIP("출장"),
    OTHER("기타");

    private final String displayName;

    LeaveType(String displayName) {
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
