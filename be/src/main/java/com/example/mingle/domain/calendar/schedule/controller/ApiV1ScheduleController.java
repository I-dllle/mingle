package com.example.mingle.domain.calendar.schedule.controller;

import com.example.mingle.domain.calendar.schedule.dto.ScheduleRequest;
import com.example.mingle.domain.calendar.schedule.dto.ScheduleResponse;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
import com.example.mingle.domain.calendar.schedule.service.ScheduleService;
import com.example.mingle.domain.user.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

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

    //월별 타입에 따라 조회
    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> listMonthViewSchedules(
            @RequestParam ScheduleType type,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        if (customUser == null) {
            throw new UsernameNotFoundException("인증된 사용자를 찾을 수 없습니다.");
        }
        Long userId = customUser.getId();


        // 2) 서비스에 위임 (year/month가 null이면 내부에서 현재 달로 처리)
        List<ScheduleResponse> list = scheduleService.getMonthlySchedules(
                userId, type, year, month);

        return ResponseEntity.ok(list);
    }
}


