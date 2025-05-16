package com.example.mingle.domain.admin.panel.controller;

import com.example.mingle.domain.post.legalpost.service.SettlementService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/revenue")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRevenueController {
    private final SettlementService settlementService;

    // 전체 수익
    @GetMapping("/total-revenue")
    @Operation(summary = "전체 총 수익 조회")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        return ResponseEntity.ok(settlementService.getTotalRevenue());
    }

    // 특정 유저 수익
    @GetMapping("/users/{userId}/total-revenue")
    @Operation(summary = "특정 유저의 총 수익 조회")
    public ResponseEntity<BigDecimal> getTotalRevenueByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(settlementService.getTotalRevenueByUser(userId));
    }

}