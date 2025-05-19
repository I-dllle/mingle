package com.example.mingle.domain.attendance.attendanceRequest.controller;

import com.example.mingle.domain.admin.approval.entity.ApprovalStatus;
import com.example.mingle.domain.attendance.util.AttendanceMapper;
import com.example.mingle.domain.attendance.attendanceRequest.dto.ApprovalActionRequest;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDetailDto;
import com.example.mingle.domain.attendance.attendanceRequest.dto.AttendanceRequestDto;
import com.example.mingle.domain.attendance.attendanceRequest.entity.AttendanceRequest;
import com.example.mingle.domain.attendance.attendanceRequest.service.AttendanceRequestService;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.rq.Rq;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/attendance-requests")
public class ApiV1AttendanceRequestController {
    private final AttendanceRequestService attendanceRequestService;
    private final AttendanceMapper mapper;
    private final Rq rq;

    // ============================== 일반 사용자용 API ==============================

    // 사용자 요청 생성
    @PostMapping
    public ResponseEntity<AttendanceRequestDetailDto> submitRequest(
            @Valid @RequestBody AttendanceRequestDto dto
    ) {
        Long userId = rq.getActor().getId();
        AttendanceRequest request = attendanceRequestService.submitRequest(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toDetailDto(request));
    }

    // 사용자 단일 요청 상세 조회
    @GetMapping("/{requestId}")
    public ResponseEntity<AttendanceRequestDetailDto> getRequest(
            @PathVariable(name = "requestId") Long requestId
    ) {
        Long userId = rq.getActor().getId();
        AttendanceRequest request = attendanceRequestService.getRequestById(requestId, userId);
        return ResponseEntity.ok(mapper.toDetailDto(request));
    }

    // 사용자 본인 요청 목록 조회 (상태별, 기간별, 페이징)
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
        Page<AttendanceRequest> requests = attendanceRequestService.getUserRequestsByStatus(
                userId, status, yearMonth, pageable.getPageNumber(), pageable.getPageSize());

        return ResponseEntity.ok(requests.map(mapper::toDetailDto));
    }

    // 사용자 요청 수정
    @PutMapping("/{requestId}")
    public ResponseEntity<AttendanceRequestDetailDto> updateRequest(
            @PathVariable(name = "requestId") Long requestId,
            @Valid @RequestBody AttendanceRequestDto dto
    ) {
        Long userId = rq.getActor().getId();
        AttendanceRequest request = attendanceRequestService.updateRequest(requestId, dto, userId);
        return ResponseEntity.ok(mapper.toDetailDto(request));
    }

    // 사용자 요청 삭제
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
    @GetMapping("/admin/{requestId}")
    public ResponseEntity<AttendanceRequestDetailDto> getRequestForAdmin(
            @PathVariable(name = "requestId") Long requestId
    ) {
        verifyAdmin();
        AttendanceRequest request = attendanceRequestService.getRequestByIdForAdmin(requestId);
        return ResponseEntity.ok(mapper.toDetailDto(request));
    }

    // 관리자용 전체 출결 요청 목록 조회 (상태별, 기간별, 페이징)
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
        Page<AttendanceRequest> requests = attendanceRequestService.getAllRequestsByStatus(
                status, yearMonth,  pageable.getPageNumber(), pageable.getPageSize());
        
        return ResponseEntity.ok(requests.map(mapper::toDetailDto));
    }

    // 관리자용 요청 승인
    @PostMapping("/admin/{requestId}/approve")
    public ResponseEntity<AttendanceRequestDetailDto> approveRequest(
            @PathVariable Long requestId,
            @Valid @RequestBody(required = false) ApprovalActionRequest request
    ) {
        verifyAdmin();
        Long adminId = rq.getActor().getId();
        String comment = request != null ? request.getComment() : "";

        AttendanceRequest approvedRequest = attendanceRequestService.approveRequest(
                requestId, comment, adminId);
        
        return ResponseEntity.ok(mapper.toDetailDto(approvedRequest));
    }

    // 관리자용 요청 거절
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
        AttendanceRequest rejectedRequest = attendanceRequestService.rejectRequest(
                requestId, request.getComment(), adminId);

        return ResponseEntity.ok(mapper.toDetailDto(rejectedRequest));
    }

    // 관리자용 요청 상태 변경 (승인/반려 이외의 상태 변경)
    @PatchMapping("/admin/{requestId}/status")
    public ResponseEntity<AttendanceRequestDetailDto> changeRequestStatus(
            @PathVariable Long requestId,
            @Valid @RequestBody ApprovalActionRequest request
    ) {
        verifyAdmin();
        Long adminId = rq.getActor().getId();
        AttendanceRequest updatedRequest = attendanceRequestService.changeRequestStatus(
                requestId, request.getApprovalStatus(), request.getComment(), adminId);
        
        return ResponseEntity.ok(mapper.toDetailDto(updatedRequest));
    }
}