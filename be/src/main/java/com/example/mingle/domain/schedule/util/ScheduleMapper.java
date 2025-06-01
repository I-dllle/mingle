package com.example.mingle.domain.schedule.util;

import com.example.mingle.domain.schedule.dto.ScheduleRequest;
import com.example.mingle.domain.schedule.dto.ScheduleResponse;
import com.example.mingle.domain.schedule.entity.Schedule;
import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ScheduleMapper {

    //요청 dto를 엔티티로 변환
    public Schedule toEntity(ScheduleRequest request, User user, Post post, Department department) {
        if (request == null) {
            return null;
        }
        return Schedule.builder()
                .user(user)
                .post(post)
                .department(department)
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .scheduleType(request.getScheduleType())
                .scheduleStatus(request.getScheduleStatus())
                .memo(request.getMemo())
                .build();
    }

    public Schedule toEntity(ScheduleRequest req, User user, Post post) {
        return toEntity(req, user, post, null);
    }

    public ScheduleResponse toResponse(Schedule schedule) {
        if (schedule == null) {
            return null;
        }
        Long postId = schedule.getPost() != null ? schedule.getPost().getId() : null;

        Long departmentId = schedule.getDepartment() != null
                ? schedule.getDepartment().getId()
                : null;

        return ScheduleResponse.builder()
                .id(schedule.getId())
                .userId(schedule.getUser().getId())
                .postId(postId)
                .departmentId(departmentId)
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

    public void updateEntityFromRequest(Schedule schedule, ScheduleRequest request, Department department) {
        if (request == null || schedule == null) {
            return;
        }
        schedule.setTitle(request.getTitle());
        schedule.setDescription(request.getDescription());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setScheduleType(request.getScheduleType());
        schedule.setScheduleStatus(request.getScheduleStatus());
        schedule.setMemo(request.getMemo());
        schedule.setDepartment(department);
    }

}

