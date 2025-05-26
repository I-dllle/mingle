package com.example.mingle.domain.admin.panel.controller;

import com.example.mingle.domain.post.legalpost.dto.settlement.ArtistRevenueDto;
import com.example.mingle.domain.post.legalpost.dto.settlement.SettlementDetailResponse;
import com.example.mingle.domain.post.legalpost.dto.settlement.SettlementDto;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.service.SettlementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/revenue")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "AdminRevenue", description = "관리자 전용 수익 관리 API")
public class ApiV1AdminRevenueController {
    private final SettlementService settlementService;

    // 전체 수익
    @GetMapping("/total-revenue")
    @Operation(summary = "전체 또는 기간별 총 수익 조회")
    public ResponseEntity<BigDecimal> getTotalRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(settlementService.getTotalRevenue(startDate, endDate));
    }


    // 특정 유저 수익
    @GetMapping("/users/{userId}/total-revenue")
    @Operation(summary = "특정 유저의 총 수익 조회")
    public ResponseEntity<BigDecimal> getTotalRevenueByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(settlementService.getTotalRevenueByUser(userId));
    }

    @GetMapping("/net-agency")
    @Operation(summary = "회사의 순수익 조회")
    public ResponseEntity<BigDecimal> getAgencyNetRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime endDate
    ) {
        return ResponseEntity.ok(settlementService.getAgencyRevenue(startDate, endDate));
    }

    @GetMapping("/monthly-summary")
    @Operation(summary = "월별 수익 요약 통계")
    public ResponseEntity<Map<YearMonth, BigDecimal>> getMonthlyRevenueSummary() {
        return ResponseEntity.ok(settlementService.getMonthlyRevenueSummary());
    }

    @GetMapping("/top-artists")
    @Operation(summary = "수익 상위 아티스트 리스트")
    public ResponseEntity<List<ArtistRevenueDto>> getTopArtists(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(settlementService.getTopArtistsByRevenue(limit));
    }

    @GetMapping("/ratio-summary")
    @Operation(summary = "RatioType별 총 수익 분배 요약")
    public ResponseEntity<Map<RatioType, BigDecimal>> getRevenueByRatioType() {
        return ResponseEntity.ok(settlementService.getRevenueByRatioType());
    }

    @GetMapping("/contracts/{contractId}/revenue")
    @Operation(summary = "특정 계약서 기준 수익 조회")
    public ResponseEntity<BigDecimal> getRevenueByContract(@PathVariable Long contractId) {
        return ResponseEntity.ok(settlementService.getRevenueByContract(contractId));
    }

    @GetMapping("/contracts/{contractId}/settlements")
    @Operation(summary = "계약서 기준 정산 상세 내역 조회")
    public ResponseEntity<List<SettlementDetailResponse>> getSettlementDetailsByContract(@PathVariable Long contractId) {
        return ResponseEntity.ok(settlementService.getSettlementDetailsByContract(contractId));
    }

    @GetMapping
    @Operation(summary = "모든 정산 리스트")
    public ResponseEntity<List<SettlementDto>> getAll() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }
}