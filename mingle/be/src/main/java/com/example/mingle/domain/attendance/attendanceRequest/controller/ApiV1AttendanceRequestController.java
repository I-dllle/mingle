package com.example.mingle.domain.attendance.attendanceRequest.controller;

import com.example.mingle.domain.attendance.enums.ApprovalStatus;
import com.example.mingle.domain.attendance.attendanceRequest.dto.ApprovalActionRequest;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDetailDto;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDto;
import com.example.mingle.domain.attendance.attendanceRequest.service.AttendanceRequestService;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.rq.Rq;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/attendance-requests")
@Tag(name = "Attendance Request", description = "휴가 요청 API (사용자 및 관리자)")
public class ApiV1AttendanceRequestController {

    private final AttendanceRequestService attendanceRequestService;
    private final Rq rq;

    // ============================== 일반 사용자용 API ==============================

    // 사용자 요청 생성
    @Operation(summary = "출결 요청 생성", description = "일반 사용자가 휴가, 출장, 조퇴 등의 요청을 생성합니다.")
    @PostMapping
    public ResponseEntity<AttendanceRequestDetailDto> submitRequest(
            @Valid @RequestBody AttendanceRequestDto dto
    ) {
        Long userId = rq.getActor().getId();
        AttendanceRequestDetailDto request = attendanceRequestService.submitRequest(dto, userId);
        return ResponseEntity.ok(request);
    }

    // 사용자 단일 요청 상세 조회
    @Operation(summary = "출결 요청 상세 조회", description = "본인의 요청 중 하나를 상세 조회합니다.")
    @GetMapping("/{requestId}")
    public ResponseEntity<AttendanceRequestDetailDto> getRequest(
            @PathVariable(name = "requestId") Long requestId
    ) {
        Long userId = rq.getActor().getId();
        AttendanceRequestDetailDto request = attendanceRequestService.getRequestById(requestId, userId);
        return ResponseEntity.ok(request);
    }

    // 사용자 본인 요청 목록 조회 (상태별, 기간별, 페이징)
    @Operation(summary = "출결 요청 목록 조회", description = "상태와 기간에 따라 본인의 출결 요청을 페이징 조회합니다.")
    @GetMapping
    public ResponseEntity<Page<AttendanceRequestDetailDto>> getUserRequests(
            @RequestParam(required = false, defaultValue = "PENDING") ApprovalStatus status,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Long userId = rq.getActor().getId();
        
        // yearMonth가 null이면 현재 달로 설정
        if (yearMonth == null) {
            yearMonth = YearMonth.now();
        }
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, Sort.by("startDate").descending());
        Page<AttendanceRequestDetailDto> requests = attendanceRequestService.getUserRequestsByStatus(
                userId, status, yearMonth, pageable.getPageNumber(), pageable.getPageSize());

        return ResponseEntity.ok(requests);
    }

    // 사용자 요청 수정
    @Operation(summary = "출결 요청 수정", description = "사용자가 본인의 출결 요청을 수정합니다.")
    @PutMapping("/{requestId}")
    public ResponseEntity<AttendanceRequestDetailDto> updateRequest(
            @PathVariable(name = "requestId") Long requestId,
            @Valid @RequestBody AttendanceRequestDto dto
    ) {
        Long userId = rq.getActor().getId();
        AttendanceRequestDetailDto request = attendanceRequestService.updateRequest(requestId, dto, userId);
        return ResponseEntity.ok(request);
    }

    // 사용자 요청 삭제
    @Operation(summary = "출결 요청 삭제", description = "사용자가 본인의 요청을 삭제합니다.")
    @DeleteMapping("/{requestId}")
    public ResponseEntity<Void> deleteRequest(
            @PathVariable(name = "requestId") Long requestId
    ) {
        Long userId = rq.getActor().getId();
        attendanceRequestService.deleteRequest(requestId, userId);
        return ResponseEntity.noContent().build();
    }


    // ============================== 관리자용 API ==============================

    // 관리자 전용 헬퍼
    private void verifyAdmin() {
        if (rq.getActor().getRole() != UserRole.ADMIN) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
    }

    // 관리자용 단일 요청 상세 조회
    @Operation(summary = "요청 상세 조회 (관리자)", description = "관리자가 특정 요청의 상세 내용을 조회합니다.")
    @GetMapping("/admin/{requestId}")
    public ResponseEntity<AttendanceRequestDetailDto> getRequestForAdmin(
            @PathVariable(name = "requestId") Long requestId
    ) {
        verifyAdmin();
        AttendanceRequestDetailDto request = attendanceRequestService.getRequestByIdForAdmin(requestId);
        return ResponseEntity.ok(request);
    }

    // 관리자용 전체 출결 요청 목록 조회 (상태별, 기간별, 페이징)
    @Operation(summary = "요청 목록 조회 (관리자)", description = "관리자가 조건에 따라 모든 사용자의 요청을 페이징 조회합니다.")
    @GetMapping("/admin")
    public ResponseEntity<Page<AttendanceRequestDetailDto>> getAllRequests(
            @RequestParam(required = false, defaultValue = "PENDING") ApprovalStatus status,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        verifyAdmin();
        // yearMonth가 null이면 현재 달로 설정
        if (yearMonth == null) {
            yearMonth = YearMonth.now();
        }
        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, Sort.by("startDate").descending());
        Page<AttendanceRequestDetailDto> requests = attendanceRequestService.getAllRequestsByStatus(
                status, yearMonth,  pageable.getPageNumber(), pageable.getPageSize());
        
        return ResponseEntity.ok(requests);
    }

    // 관리자용 요청 승인
    @Operation(summary = "요청 승인 (관리자)", description = "관리자가 요청을 승인하고 출결 데이터에 반영합니다.")
    @PostMapping("/admin/{requestId}/approve")
    public ResponseEntity<AttendanceRequestDetailDto> approveRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody(required = false) ApprovalActionRequest request
    ) {
        verifyAdmin();
        Long adminId = rq.getActor().getId();
        String comment = request != null ? request.getComment() : "";

        AttendanceRequestDetailDto approvedRequest = attendanceRequestService.approveRequest(
                requestId, comment, adminId);
        
        return ResponseEntity.ok(approvedRequest);
    }

    // 관리자용 요청 거절
    @Operation(summary = "요청 반려 (관리자)", description = "관리자가 요청을 반려 처리합니다.")
    @PostMapping("/admin/{requestId}/reject")
    public ResponseEntity<AttendanceRequestDetailDto> rejectRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody ApprovalActionRequest request
    ) {
        verifyAdmin();
        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            throw new ApiException(ErrorCode.REJECT_REASON_REQUIRED);
        }
        Long adminId = rq.getActor().getId();
        AttendanceRequestDetailDto rejectedRequest = attendanceRequestService.rejectRequest(
                requestId, request.getComment(), adminId);

        return ResponseEntity.ok(rejectedRequest);
    }

    // 관리자용 요청 상태 변경 (승인/반려 이외의 상태 변경)
    @Operation(summary = "요청 상태 변경 (관리자)", description = "관리자가 요청의 상태를 임의로 변경합니다.")
    @PatchMapping("/admin/{requestId}/status")
    public ResponseEntity<AttendanceRequestDetailDto> changeRequestStatus(
            @PathVariable Long requestId,
            @Valid @RequestBody ApprovalActionRequest request
    ) {
        verifyAdmin();
        Long adminId = rq.getActor().getId();
        AttendanceRequestDetailDto updatedRequest = attendanceRequestService.changeRequestStatus(
                requestId, request.getApprovalStatus(), request.getComment(), adminId);
        
        return ResponseEntity.ok(updatedRequest);
    }
}