package com.example.mingle.domain.calendar.schedule.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScheduleStatus {
    중요회의, 출장, 일정완료, 일정취소, 휴가
}

