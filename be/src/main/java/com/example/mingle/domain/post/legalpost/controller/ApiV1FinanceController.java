package com.example.mingle.domain.post.legalpost.controller;

import com.example.mingle.domain.post.legalpost.dto.settlement.*;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import com.example.mingle.domain.post.legalpost.service.SettlementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LEGAL')")
@Tag(name = "finance", description = "회계팀 API")
public class ApiV1FinanceController {

    private final SettlementService settlementService;
    private final SettlementRepository settlementRepository;

    // 관리자/회계팀이 수익 입력 시 호출
    @PostMapping("/contracts/{id}/settlements")
    public ResponseEntity<?> createSettlement(
            @PathVariable Long id,
            @RequestBody SettlementRequest request
    ) {
        settlementService.createSettlement(id, request.getTotalRevenue());
        return ResponseEntity.ok("정산 생성 완료");
    }

    // 특정 계약의 정산 리스트
    @GetMapping("/{id}/settlements")
    public ResponseEntity<List<SettlementDto>> getSettlementsByContract(@PathVariable Long id) {
        List<Settlement> settlements = settlementRepository.findByContractId(id);
        List<SettlementDto> result = settlements.stream()
                .map(SettlementDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    // 정산 수정
    @PutMapping("/settlements/{settlementId}")
    public ResponseEntity<?> updateSettlement(
            @PathVariable Long settlementId,
            @RequestBody UpdateSettlementRequest request
    ) {
        settlementService.updateSettlement(settlementId, request);
        return ResponseEntity.ok("정산 수정 완료");
    }

    // 정산 삭제
    @DeleteMapping("/settlements/{settlementId}")
    public ResponseEntity<?> deleteSettlement(@PathVariable Long settlementId) {
        settlementService.deleteSettlement(settlementId);
        return ResponseEntity.ok("정산 삭제 완료");
    }

    // 정산 상태 변경
    @PutMapping("/settlements/{settlementId}/status")
    public ResponseEntity<?> updateSettlementStatus(
            @PathVariable Long settlementId,
            @RequestBody ChangeSettlementStatusRequest request
    ) {
        settlementService.updateIsSettled(settlementId, request.getIsSettled());
        return ResponseEntity.ok("정산 확정 상태 변경 완료");
    }

    // 정산 통계
    @GetMapping("/summary")
    public ResponseEntity<SettlementSummaryDto> getSettlementSummary() {
        return ResponseEntity.ok(settlementService.getSummary());
    }

}
