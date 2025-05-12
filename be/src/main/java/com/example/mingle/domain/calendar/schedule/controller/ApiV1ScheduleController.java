package com.example.mingle.domain.calendar.schedule.controller;

import com.example.mingle.domain.calendar.schedule.dto.ScheduleRequest;
import com.example.mingle.domain.calendar.schedule.dto.ScheduleResponse;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
import com.example.mingle.domain.calendar.schedule.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/schedule")
public class ApiV1ScheduleController {

    private final ScheduleService scheduleService;

    // 일정 추가
    @PostMapping
    public ResponseEntity<ScheduleResponse> createSchedule(
            @AuthenticationPrincipal CustomUser user,
            @Valid @RequestBody ScheduleRequest request
    ) {
        Long userId = user.getId();
        ScheduleResponse response = scheduleService.createSchedule(request, userId, request.getPostId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 상태별 일정 조회
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByStatus(
            @PathVariable ScheduleStatus status,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        List<ScheduleResponse> responses = scheduleService.getSchedulesByStatus(userId, status);
        return ResponseEntity.ok(responses);
    }

    //월별 일정 조회
    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> listMonthViewSchedules(
            @RequestParam(required = false) ScheduleType type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        if (customUser == null) {
            throw new UsernameNotFoundException("인증된 사용자를 찾을 수 없습니다.");
        }
        Long userId = customUser.getId();

        // 서비스에 위임 (년/월 정보를 LocalDate에서 추출)
        List<ScheduleResponse> list = scheduleService.getMonthlyView(
                userId, type, date);

        return ResponseEntity.ok(list);
    }

    // 주간 일정 조회
    @GetMapping("/weekly")
    public ResponseEntity<List<ScheduleResponse>> getWeeklyView(
            @RequestParam(required = false) ScheduleType type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        List<ScheduleResponse> responses = scheduleService.getWeeklyView(userId, date, type);
        return ResponseEntity.ok(responses);
    }

    // 일간 일정 조회
    @GetMapping("/daily")
    public ResponseEntity<List<ScheduleResponse>> getDailyView(
            @RequestParam(required = false) ScheduleType type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        List<ScheduleResponse> responses = scheduleService.getDailyView(userId, date, type);
        return ResponseEntity.ok(responses);
    }

    // 일정 수정
    @PutMapping("/{scheduleId}")
    public ResponseEntity<ScheduleResponse> updateSchedule(
            @PathVariable(name = "scheduleId") Long scheduleId,
            @AuthenticationPrincipal CustomUser customUser,
            @Valid @RequestBody ScheduleRequest request
    ) {
        Long userId = customUser.getId();
        ScheduleResponse response = scheduleService.updateSchedule(request, scheduleId, userId);
        return ResponseEntity.ok(response);
    }

    // 일정 삭제
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(
            @PathVariable(name = "scheduleId") Long scheduleId
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        scheduleService.deleteSchedule(scheduleId, userId);
        return ResponseEntity.noContent().build();
    }
}


