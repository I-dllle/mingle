package com.example.mingle.domain.admin.dashboard.controller;

import com.example.mingle.domain.admin.dashboard.service.AdminDashboardService;
import com.example.mingle.domain.admin.panel.dto.DashboardActivityDto;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import com.example.mingle.domain.post.legalpost.service.SettlementService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ApiV1DashboardController {
        private final SettlementService settlementService;
        private final ContractService contractService;
        private final AdminDashboardService dashboardService;
    @GetMapping("/monthly-contract-count")
    @Operation(summary = "이번 달 계약 건수 조회")
    public ResponseEntity<Long> getMonthlyContractCount() {
        return ResponseEntity.ok(contractService.getMonthlyContractCount());
    }

    @GetMapping("/monthly-summary")
    @Operation(summary = "월별 수익 요약 통계")
    public ResponseEntity<Map<YearMonth, BigDecimal>> getMonthlyRevenueSummary() {
        return ResponseEntity.ok(settlementService.getMonthlyRevenueSummary());
    }

    @GetMapping("/monthly-total-revenue")
    @Operation(summary = "이번 달 총 수익 조회")
    public ResponseEntity<BigDecimal> getMonthlyTotalRevenue() {
        return ResponseEntity.ok(settlementService.getMonthlyTotalRevenue());
    }

    @GetMapping("/contract-status-summary")
    @Operation(summary = "계약 상태별 건수 요약")
    public ResponseEntity<Map<ContractStatus, Long>> getContractStatusSummary() {
        return ResponseEntity.ok(contractService.getContractStatusSummary());
    }

    @GetMapping("/recent-activities")
    @Operation(summary = "최근 활동 요약")
    public ResponseEntity<DashboardActivityDto> getRecentActivities() {
        return ResponseEntity.ok(dashboardService.getRecentActivities());
    }
}
