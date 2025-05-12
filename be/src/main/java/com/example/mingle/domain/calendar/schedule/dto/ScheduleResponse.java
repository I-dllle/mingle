package com.example.mingle.domain.calendar.schedule.dto;

import com.example.mingle.domain.calendar.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {
    private Long id;
    private Long userId;
    private Long postId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String memo;
    private ScheduleType scheduleType;
    private ScheduleStatus scheduleStatus;
}
