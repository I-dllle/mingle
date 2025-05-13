package com.example.mingle.domain.calendar.schedule.controller;

import com.example.mingle.domain.calendar.schedule.dto.ScheduleRequest;
import com.example.mingle.domain.calendar.schedule.dto.ScheduleResponse;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.calendar.schedule.entity.ScheduleType;
import com.example.mingle.domain.calendar.schedule.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Schedule", description = "일정 관리 API")
public class ApiV1ScheduleController {

    private final ScheduleService scheduleService;

    // 일정 추가
    @Operation(summary = "일정 생성", description = "새 일정을 생성하고 생성된 일정을 반환합니다.")
    @PostMapping
    public ResponseEntity<ScheduleResponse> createSchedule(
            @AuthenticationPrincipal CustomUser user,
            @Parameter(description = "생성할 일정 정보", required = true)
            @Valid @RequestBody ScheduleRequest request
    ) {
        Long userId = user.getId();
        ScheduleResponse response = scheduleService.createSchedule(request, userId, request.getPostId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    // 상태별 일정 조회
    @Operation(summary = "상태별 일정 조회", description = "특정 상태의 일정을 조회합니다.")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByStatus(
            @Parameter(description = "조회할 일정 상태", example = "중요회의, 휴가, 출장 등")
            @PathVariable ScheduleStatus status,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        List<ScheduleResponse> responses = scheduleService.getSchedulesByStatus(userId, status);
        return ResponseEntity.ok(responses);
    }

    //월별 일정 조회
    @Operation(summary = "월별 일정 조회", description = "특정 월의 일정을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> listMonthViewSchedules(
            @Parameter(description = "일정 타입", example = "DEPARTMENT, COMPANY, PERSONAL")
            @RequestParam(required = false) ScheduleType type,
            @Parameter(description = "조회 기준 날짜(ISO)", example = "2025-05-13")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        if (customUser == null) {
            throw new UsernameNotFoundException("인증된 사용자를 찾을 수 없습니다.");
        }
        Long userId = customUser.getId();

        List<ScheduleResponse> list = scheduleService.getMonthlyView(userId, type, date);

        return ResponseEntity.ok(list);
    }

    // 주간 일정 조회
    @Operation(summary = "주간 일정 조회", description = "특정 주의 일정을 조회합니다.")
    @GetMapping("/weekly")
    public ResponseEntity<List<ScheduleResponse>> getWeeklyView(
            @Parameter(description = "일정 타입", example = "DEPARTMENT, COMPANY, PERSONAL")
            @RequestParam(required = false) ScheduleType type,
            @Parameter(description = "조회 기준 날짜(ISO)", example = "2025-05-13")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        List<ScheduleResponse> responses = scheduleService.getWeeklyView(userId, date, type);
        return ResponseEntity.ok(responses);
    }

    // 일간 일정 조회
    @Operation(summary = "일간 일정 조회", description = "특정 일의 일정을 조회합니다.")
    @GetMapping("/daily")
    public ResponseEntity<List<ScheduleResponse>> getDailyView(
            @Parameter(description = "일정 타입", example = "DEPARTMENT, COMPANY, PERSONAL")
            @RequestParam(required = false) ScheduleType type,
            @Parameter(description = "조회 기준 날짜(ISO)", example = "2025-05-13")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        List<ScheduleResponse> responses = scheduleService.getDailyView(userId, date, type);
        return ResponseEntity.ok(responses);
    }

    // 일정 수정
    @PutMapping("/{scheduleId}")
    @Operation(summary = "일정 수정", description = "기존 일정을 수정하고 수정된 일정을 반환합니다.")
    public ResponseEntity<ScheduleResponse> updateSchedule(
            @Parameter(description = "수정할 일정 ID", example = "1")
            @PathVariable(name = "scheduleId") Long scheduleId,
            @AuthenticationPrincipal CustomUser customUser,
            @Valid @RequestBody ScheduleRequest request
    ) {
        Long userId = customUser.getId();
        ScheduleResponse response = scheduleService.updateSchedule(request, scheduleId, userId);
        return ResponseEntity.ok(response);
    }

    // 일정 삭제
    @Operation(summary = "일정 삭제", description = "지정한 일정을 삭제합니다.")
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(
            @Parameter(description = "삭제할 일정 ID", example = "1")
            @PathVariable(name = "scheduleId") Long scheduleId,
            @AuthenticationPrincipal CustomUser customUser
    ) {
        Long userId = customUser.getId();
        scheduleService.deleteSchedule(scheduleId, userId);
        return ResponseEntity.noContent().build();
    }
}


