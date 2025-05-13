package com.example.mingle.domain.attendance.enums;

public enum AttendanceStatus {
    PRESENT("정상"),
    LATE("지각"),
    EARLY_LEAVE("조퇴"),
    ABSENT("결근"),
    OVERTIME("연장근무"),
    VACATION("휴가"),
    HALF_DAY("반차"),
    BUSINESS_TRIP("출장");

    private final String displayName;

    AttendanceStatus(String displayName){
        this.displayName = displayName;
    }

    public String getDisplayName(){
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
