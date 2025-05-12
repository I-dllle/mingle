package com.example.mingle.domain.calendar.schedule.util;

import com.example.mingle.domain.calendar.schedule.dto.ScheduleResponse;
import com.example.mingle.domain.calendar.schedule.entity.Schedule;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ScheduleMapper {

    public ScheduleResponse toResponse(Schedule schedule) {
        if (schedule == null) {
            return null;
        }

        Long postId = schedule.getPost() != null ? schedule.getPost().getId() : null;

        return ScheduleResponse.builder()
                .id(schedule.getId())
                .userId(schedule.getUser().getId())
                .postId(postId)
                .title(schedule.getTitle())
                .description(schedule.getDescription())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .memo(schedule.getMemo())
                .scheduleType(schedule.getScheduleType())
                .scheduleStatus(schedule.getScheduleStatus())
                .build();
    }

    public List<ScheduleResponse> toResponseList(List<Schedule> schedules) {
        if (schedules == null) {
            return List.of();
        }

        return schedules.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}

