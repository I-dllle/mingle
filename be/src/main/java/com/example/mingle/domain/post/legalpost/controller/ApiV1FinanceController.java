package com.example.mingle.domain.post.legalpost.controller;

import com.example.mingle.domain.post.legalpost.dto.settlement.*;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import com.example.mingle.domain.post.legalpost.service.SettlementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
//@PreAuthorize("@authService.isInDepartment(authentication, 3L)") // 부서 ID로 판단
@Tag(name = "finance", description = "회계팀 API")
public class ApiV1FinanceController {

    private final SettlementService settlementService;
    private final SettlementRepository settlementRepository;

    // 정산 생성 (확정된 계약 기준, SettlementRatio 기준으로 Detail 생성)
    @PostMapping("/contracts/{id}/settlements")
    @Operation(summary = "정산 생성(확정)")
    public ResponseEntity<?> createSettlement(
            @PathVariable Long id,
            @RequestBody SettlementRequest request
    ) {
        settlementService.createSettlement(id, request.getTotalRevenue(), request.getDetails());
        return ResponseEntity.ok("정산 생성 완료");
    }

    // 특정 계약의 정산 목록 조회
    @GetMapping("/contracts/{id}/settlements")
    @Operation(summary = "특정 계약의 정산 리스트")
    public ResponseEntity<List<SettlementDto>> getSettlementsByContract(@PathVariable Long id) {
        List<Settlement> settlements = settlementRepository.findByContractId(id);
        List<SettlementDto> result = settlements.stream()
                .map(SettlementDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    // 정산 수정
    @PutMapping("/settlements/{settlementId}")
    @Operation(summary = "정산 수정")
    public ResponseEntity<?> updateSettlement(
            @PathVariable Long settlementId,
            @RequestBody UpdateSettlementRequest request
    ) {
        settlementService.updateSettlement(settlementId, request);
        return ResponseEntity.ok("정산 수정 완료");
    }

    // 정산 삭제
    @DeleteMapping("/settlements/{settlementId}")
    @Operation(summary = "정산 삭제")
    public ResponseEntity<?> deleteSettlement(@PathVariable Long settlementId) {
        settlementService.deleteSettlement(settlementId);
        return ResponseEntity.ok("정산 삭제 완료");
    }

    // 정산 상태 변경 (정산 확정 여부만 true/false)
    @PutMapping("/settlements/{settlementId}/status")
    @Operation(summary = "정산 상태 변경")
    public ResponseEntity<?> updateSettlementStatus(
            @PathVariable Long settlementId,
            @RequestBody ChangeSettlementStatusRequest request
    ) {
        settlementService.updateIsSettled(settlementId, request.getIsSettled());
        return ResponseEntity.ok("정산 확정 상태 변경 완료");
    }

    // 전체 정산 통계 요약 (합계 등)
    @GetMapping("/summary")
    @Operation(summary = "정산 통계")
    public ResponseEntity<SettlementSummaryDto> getSettlementSummary() {
        return ResponseEntity.ok(settlementService.getSummary());
    }

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

    @GetMapping("/net-agency")
    @Operation(summary = "회사의 순수익 조회")
    public ResponseEntity<BigDecimal> getAgencyNetRevenue() {
        return ResponseEntity.ok(settlementService.getAgencyRevenue());
    }

    @GetMapping("/monthly-summary")
    @Operation(summary = "월별 수익 요약 통계")
    public ResponseEntity<Map<YearMonth, BigDecimal>> getMonthlyRevenueSummary() {
        return ResponseEntity.ok(settlementService.getMonthlyRevenueSummary());
    }


    @GetMapping("/top-artists")
    @Operation(summary = "수익 상위 아티스트 리스트")
    public ResponseEntity<List<ArtistRevenueDto>> getTopArtists(
            @RequestParam(defaultValue = "10") int limit
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

}
