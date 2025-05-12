package com.example.mingle.domain.calendar.shcedule.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ScheduleType {
    PERSONAL,   // 개인 일정
    TEAM,       // 팀 일정
    COMPANY     // 회사 공통 일정
}
