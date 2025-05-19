package com.example.mingle.domain.attendance.attendance.controller;

import com.example.mingle.domain.attendance.attendance.dto.AttendanceDetailDto;
import com.example.mingle.domain.attendance.attendance.dto.AttendanceRecordDto;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDto;
import com.example.mingle.domain.attendance.attendance.dto.request.OvertimeRequestDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendanceMonthStatsDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendancePageResponseDto;
import com.example.mingle.domain.attendance.attendance.dto.response.WorkHoursChartResponseDto;
import com.example.mingle.domain.attendance.attendance.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/attendances/{userId}")
@Tag(name = "Attendance", description = "근태 관리 API")
public class ApiV1AttendanceController {

    private final AttendanceService attendanceService;

    @Operation(summary = "출근 처리", description = "사용자의 출근을 기록합니다.")
    @PostMapping("/check-in")
    public ResponseEntity<AttendanceRecordDto> checkIn(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId) {
        AttendanceRecordDto result = attendanceService.checkIn(userId);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "퇴근 처리", description = "사용자의 퇴근을 기록합니다.")
    @PostMapping("/check-out")
    public ResponseEntity<AttendanceRecordDto> checkOut(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId) {
        AttendanceRecordDto result = attendanceService.checkOut(userId);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "야근 보고", description = "야근 내역을 보고합니다.")
    @PostMapping("/overtime")
    public ResponseEntity<AttendanceDetailDto> reportOvertime(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId,
            @RequestBody OvertimeRequestDto requestDto) {
        AttendanceDetailDto result = attendanceService.reportOvertime(userId, requestDto);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "일별 근태 조회", description = "특정 날짜의 근태 기록을 조회합니다.")
    @GetMapping("/daily")
    public ResponseEntity<AttendanceDetailDto> getDailyAttendance(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId,
            @Parameter(description = "조회 날짜 (ISO: yyyy-MM-dd)", example = "2025-05-20")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        AttendanceDetailDto result = attendanceService.getDailyAttendance(userId, date);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "최근 근태 기록 목록 조회", description = "최근 근태 기록을 페이지 단위로 조회합니다.")
    @GetMapping("/recent")
    public ResponseEntity<AttendancePageResponseDto> getRecentRecords(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId,
            @Parameter(description = "페이지 번호 ", example = "1")
            @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "페이지 크기", example = "5")
            @RequestParam(defaultValue = "5") int size) {
        AttendancePageResponseDto result = attendanceService.getRecentRecords(userId, page - 1, size);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "근무 시간 차트 데이터 조회", description = "특정 기간의 근무 시간 차트 데이터를 조회합니다.")
    @GetMapping("/chart")
    public ResponseEntity<List<WorkHoursChartResponseDto>> getChartData(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<WorkHoursChartResponseDto> result = attendanceService.getChartData(userId, startDate, endDate);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "월간 근태 통계 조회", description = "특정 월의 근태 통계를 조회합니다.")
    @GetMapping("/monthly-status")
    public ResponseEntity<AttendanceMonthStatsDto> getMonthlyStatistics(
            @Parameter(description = "사용자 ID", required = true)
            @PathVariable Long userId,
            @Parameter(description = "연-월 (ISO: yyyy-MM)", example = "2025-05")
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth ym) {
        AttendanceMonthStatsDto result = attendanceService.getMonthlyStatistics(userId, ym);
        return ResponseEntity.ok(result);
    }
}
