package com.example.mingle.domain.attendance.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum LeaveType {
    // 일반 휴가
    ANNUAL("연차"),
    SICK("병가"),
    OFFICIAL("공가"),

    // 반차
    HALF_DAY_AM("오전 반차"),
    HALF_DAY_PM("오후 반차"),

    // 특별 휴가
    MARRIAGE("결혼 휴가"),
    BEREAVEMENT("조의 휴가"),
    PARENTAL("육아 휴가"),

    // 기타 근태 관련
    BUSINESS_TRIP("출장"),
    EARLY_LEAVE("조퇴"),

    // 기타
    OTHER("기타");

    private final String displayName;

    LeaveType(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    // 상태 연결
    public AttendanceStatus toAttendanceStatus() {
        return switch (this) {
            case ANNUAL -> AttendanceStatus.ON_ANNUAL_LEAVE;
            case SICK -> AttendanceStatus.ON_SICK_LEAVE;
            case OFFICIAL -> AttendanceStatus.ON_OFFICIAL_LEAVE;
            case HALF_DAY_AM -> AttendanceStatus.ON_HALF_DAY_AM;
            case HALF_DAY_PM -> AttendanceStatus.ON_HALF_DAY_PM;
            case BUSINESS_TRIP -> AttendanceStatus.ON_BUSINESS_TRIP;
            case MARRIAGE, BEREAVEMENT, PARENTAL -> AttendanceStatus.ON_SPECIAL_LEAVE;
            case EARLY_LEAVE -> AttendanceStatus.EARLY_LEAVE;
            default -> AttendanceStatus.ABSENT;
        };
    }
}
