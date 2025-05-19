package com.example.mingle.domain.admin.approval.controller;

import com.example.mingle.domain.admin.approval.dto.ApprovalListDto;
import com.example.mingle.domain.admin.approval.dto.ApprovalRequestDto;
import com.example.mingle.domain.admin.approval.service.ApprovalService;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminApprovalController {

    private final ApprovalService approvalService;
    private final ContractService contractService;

    // 승인 대기 목록 조회
    @GetMapping
    public List<ApprovalListDto> getPendingApprovals() {
        return approvalService.getPendingApprovals();
    }

    // 특정 승인 요청 승인
    @PostMapping("/{id}/approve")
    public void approve(@PathVariable Long id, @RequestBody ApprovalRequestDto request) {
        approvalService.approve(id, request);
    }

    //승인 요청 반려
    @PostMapping("/{id}/reject")
    public void reject(@PathVariable Long id, @RequestBody ApprovalRequestDto request) {
        approvalService.reject(id, request);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<Void> confirmContract(@PathVariable Long id) {
        contractService.changeStatus(id, ContractStatus.CONFIRMED, null);
        return ResponseEntity.ok().build();
    }
}