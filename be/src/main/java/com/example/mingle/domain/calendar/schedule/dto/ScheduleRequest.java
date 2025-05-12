package com.example.mingle.domain.calendar.schedule.dto;

import com.example.mingle.domain.calendar.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequest {
    private Long postId; // 이거는 고민
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String memo;
    private ScheduleType scheduleType;  // PERSONAL, TEAM, COMPANY
    private ScheduleStatus scheduleStatus; // 중요회의, 출장, 일정완료, 일정취소, 휴가
}

