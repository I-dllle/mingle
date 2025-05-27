package com.example.mingle.domain.schedule.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScheduleStatus {
    IMPORTANT_MEETING("중요회의"),
    MEETING("회의"),
    VACATION("휴가"),
    BUSINESS_TRIP("출장"),
    COMPLETED("일정완료"),
    CANCELED("일정취소");

    private final String displayName;


}
