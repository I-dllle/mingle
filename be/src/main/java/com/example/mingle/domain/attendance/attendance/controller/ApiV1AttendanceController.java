package com.example.mingle.domain.attendance.attendance.controller;

import com.example.mingle.domain.attendance.attendance.dto.AttendanceDetailDto;
import com.example.mingle.domain.attendance.attendance.dto.AttendanceRecordDto;
import com.example.mingle.domain.attendance.attendance.dto.request.OvertimeRequestDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendanceAdminDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendanceMonthStatsDto;
import com.example.mingle.domain.attendance.attendance.dto.response.AttendancePageResponseDto;
import com.example.mingle.domain.attendance.attendance.dto.response.WorkHoursChartResponseDto;
import com.example.mingle.domain.attendance.attendance.service.AttendanceExcelService;
import com.example.mingle.domain.attendance.attendance.service.AttendanceService;
import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.rq.Rq;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/attendances")
@Tag(name = "Attendance", description = "근태 관리 API")
public class ApiV1AttendanceController {

    private final AttendanceService attendanceService;
    private final Rq rq;
    private final UserRepository userRepository;
    private final AttendanceExcelService attendanceExcelService;

    @Operation(summary = "출근 처리", description = "사용자의 출근을 기록합니다.")
    @PostMapping("/check-in")
    public ResponseEntity<AttendanceRecordDto> checkIn() {
        Long userId = rq.getActor().getId();
        AttendanceRecordDto result = attendanceService.checkIn(userId);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "퇴근 처리", description = "사용자의 퇴근을 기록합니다.")
    @PostMapping("/check-out")
    public ResponseEntity<AttendanceRecordDto> checkOut() {
        Long userId = rq.getActor().getId();
        AttendanceRecordDto result = attendanceService.checkOut(userId);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "야근 보고", description = "야근 내역을 보고합니다.")
    @PostMapping("/overtime")
    public ResponseEntity<AttendanceDetailDto> reportOvertime(@RequestBody OvertimeRequestDto requestDto) {
        Long userId = rq.getActor().getId();
        AttendanceDetailDto result = attendanceService.reportOvertime(userId, requestDto);
        return ResponseEntity.ok(result);
    }

    @Transactional(readOnly = true)
    @Operation(summary = "사용자별 근태 전체 조회")
    @GetMapping("/all")
    public ResponseEntity<Page<AttendanceAdminDto>> getAllAttendanceRecords(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) AttendanceStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Long userId = rq.getActor().getId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        Long departmentId = user.getDepartment().getId();
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, Sort.by("date").descending());
        Page<AttendanceAdminDto> result = attendanceService.getFilteredAttendanceRecords(
                yearMonth, departmentId, userId, keyword, status, pageable
        );

        return ResponseEntity.ok(result);
    }

    @Operation(
            summary = "자신의 근태 상세 조회 (ID 기준)",
            description = "현재 로그인된 사용자의 attendanceId를 받아, 해당 근태 정보를 반환합니다."
    )
    @GetMapping("/{attendanceId}")
    public ResponseEntity<AttendanceDetailDto> getAttendanceByAttendanceId(
            @PathVariable(name = "attendanceId") Long attendanceId) {

        // 1) 현재 로그인된 사용자 ID
        Long userId = rq.getActor().getId();

        // 2) 서비스 호출
        AttendanceDetailDto detail = attendanceService.getAttendanceByAttendanceId(attendanceId, userId);
        return ResponseEntity.ok(detail);
    }


    @Operation(
            summary = "일별 근태 조회",
            description = "특정 날짜(date 쿼리 파라미터)의 내 근태 정보를 반환합니다."
    )
    @GetMapping("/daily")
    @Transactional(readOnly = true)
    public ResponseEntity<AttendanceDetailDto> getDailyAttendance(
            @Parameter(description = "ISO 형식 날짜 (yyyy-MM-dd)", example = "2025-06-02")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        Long userId = rq.getActor().getId();
        // service에서 userId와 date를 기반으로 근태 정보 조회
        AttendanceDetailDto detail = attendanceService. getDailyAttendance(userId, date);
        return ResponseEntity.ok(detail);
    }

    @Operation(summary = "최근 근태 기록 목록 조회", description = "최근 근태 기록을 페이지 단위로 조회합니다.")
    @GetMapping("/recent")
    public ResponseEntity<AttendancePageResponseDto> getRecentRecords(
            @Parameter(description = "페이지 번호 ", example = "1")
            @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "페이지 크기", example = "5")
            @RequestParam(defaultValue = "5") int size) {
        Long userId = rq.getActor().getId();
        AttendancePageResponseDto result = attendanceService.getRecentRecords(userId, page - 1, size);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "근무 시간 차트 데이터 조회", description = "특정 기간의 근무 시간 차트 데이터를 조회합니다.")
    @GetMapping("/chart")
    public ResponseEntity<List<WorkHoursChartResponseDto>> getChartData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long userId = rq.getActor().getId();
        List<WorkHoursChartResponseDto> result = attendanceService.getChartData(userId, startDate, endDate);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "월간 근태 통계 조회", description = "특정 월의 근태 통계를 조회합니다.")
    @GetMapping("/monthly-status")
    public ResponseEntity<AttendanceMonthStatsDto> getMonthlyStatistics(
            @Parameter(description = "연-월 (ISO: yyyy-MM)", example = "2025-05")
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth ym) {
        Long userId = rq.getActor().getId();
        AttendanceMonthStatsDto result = attendanceService.getMonthlyStatistics(userId, ym);
        return ResponseEntity.ok(result);
    }

    // ==================== 관리자 전용 API =====================

    // 관리자용 모든 사용자 근태 조회
    // 달, 부서, 사용자 Id를 파라미터로 받아서 조회
    @Operation(summary = "관리자용 필터링 조회", description = "부서, 유저, 키워드, 상태등을 통해서 근태 조회")
    @GetMapping("/admin/all")
    public ResponseEntity<Page<AttendanceAdminDto>> getAllAttendanceRecordsForAdmin(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) AttendanceStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        if (!UserRole.ADMIN.equals(rq.getActor().getRole())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, Sort.by("date").descending());
        Page<AttendanceAdminDto> result = attendanceService.getFilteredAttendanceRecords(
                yearMonth, departmentId, userId, keyword, status, pageable
        );

        return ResponseEntity.ok(result);
    }

    // 관리자용 개별 근태 상세 조회
    @Operation(summary = "관리자용 개별 근태 조회", description = "근태 상세 개별 조회")
    @GetMapping("/admin/{attendanceId}")
    public ResponseEntity<AttendanceDetailDto> getAttendanceRecord(
            @PathVariable(name = "attendanceId") Long attendanceId
    ) {
        if (!UserRole.ADMIN.equals(rq.getActor().getRole())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        AttendanceDetailDto detail = attendanceService.getAttendanceDetailByAdmin(attendanceId);
        return ResponseEntity.ok(detail);
    }

    // 관리자용 개별 근태 수정
    @Operation(summary = "관리자용 개별 근태 수정", description = "근태 수정")
    @PutMapping("/admin/{attendanceId}")
    public ResponseEntity<AttendanceDetailDto> updateAttendanceByAdmin(
            @PathVariable Long attendanceId,
            @RequestBody AttendanceDetailDto dto
    ) {
        if (!UserRole.ADMIN.equals(rq.getActor().getRole())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        AttendanceDetailDto updated = attendanceService.updateAttendanceByAdmin(attendanceId, dto);
        return ResponseEntity.ok(updated);
    }


    // 관리자용 엑셀 다운도르
    @GetMapping("/admin/exel-download")
    public ResponseEntity<byte[]> downloadExcel(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) AttendanceStatus status
    ) throws IOException {

        if (!UserRole.ADMIN.equals(rq.getActor().getRole())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        byte[] excel = attendanceExcelService.downloadAttendanceExcel(
                startDate, endDate, departmentId, userId, keyword, status
        );

        HttpHeaders headers = new HttpHeaders();
        String filename = "근태기록_" + startDate + "~" + endDate + ".xlsx";
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + URLEncoder.encode(filename, StandardCharsets.UTF_8));

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}
