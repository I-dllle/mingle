package com.example.mingle.domain.attendance.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AttendanceStatus {
    PRESENT("정상 출근"),
    LATE("지각"),
    ABSENT("결근"),
    EARLY_LEAVE("조퇴"),
    OVERTIME("연장근무"),

    // 휴가/부재 상태
    ON_ANNUAL_LEAVE("연차"),      // 연차 사용
    ON_SICK_LEAVE("병가"),        // 병가 사용
    ON_HALF_DAY_AM("오전 반차"),   // 오전 반차 사용
    ON_HALF_DAY_PM("오후 반차"),   // 오후 반차 사용
    ON_OFFICIAL_LEAVE("공가"),    // 공가 사용
    ON_BUSINESS_TRIP("출장"),     // 출장 중

    // 기타 특별 상태
    ON_SPECIAL_LEAVE("특별 휴가"); // 결혼, 조의, 육아 등 특별 휴가

    private final String displayName;

    public boolean isLeave() {
        switch (this) {
            case ON_ANNUAL_LEAVE:
            case ON_SICK_LEAVE:
            case ON_HALF_DAY_AM:
            case ON_HALF_DAY_PM:
            case ON_OFFICIAL_LEAVE:
            case ON_SPECIAL_LEAVE:
            case ON_BUSINESS_TRIP:
                return true;
            default:
                return false;
        }
    }
}
