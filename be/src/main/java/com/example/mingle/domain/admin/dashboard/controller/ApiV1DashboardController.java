package com.example.mingle.domain.admin.dashboard.controller;

import com.example.mingle.domain.admin.dashboard.dto.DashboardSummaryDto;
import com.example.mingle.domain.admin.dashboard.service.AdminDashboardService;
//import com.example.mingle.domain.admin.dashboard.service.LegalDashboardService;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ApiV1AdminDashboardController {
    private final ContractService contractService;
    private final AdminDashboardService dashboardService;
//    private final LegalDashboardService legalDashboardService;

//    // 관리자가 계약서 최종 확정
//    @PostMapping("/{id}/confirm")
//    public ResponseEntity<Void> confirmContract(@PathVariable Long id) {
//        contractService.changeStatus(id, ContractStatus.CONFIRMED);
//        return ResponseEntity.ok().build();
//    }

    // 요약
    @GetMapping("/summary")
    public DashboardSummaryDto getSummary() {
        return dashboardService.getSummary();
    }

    // 법무
    // 계약 유형별 현황
//    @GetMapping("/contract-types")
//    public Map<String, Long> getContractTypes() {
//        return legalDashboardService.getContractTypeStats();
//    }
//
//    @GetMapping("/contract-status")
//    public Map<String, Long> getContractStatus() {
//        return legalDashboardService.getContractStatusStats();
//    }
//
//    @GetMapping("/signature-status")
//    public Map<String, Long> getSignatureStatus() {
//        return legalDashboardService.getSignatureStatusStats();
//    }
//
//    @GetMapping("/expiring-contracts")
//    public List<ContractDto> getExpiringContracts() {
//        return legalDashboardService.getExpiringContracts();
//    }
}
