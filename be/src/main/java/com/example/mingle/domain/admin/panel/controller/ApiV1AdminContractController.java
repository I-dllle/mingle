package com.example.mingle.domain.admin.panel.controller;

import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.admin.panel.dto.ContractResponse;
import com.example.mingle.domain.admin.panel.dto.ContractConditionResponse;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/contracts")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class ApiV1AdminContractController {

    private final ContractService contractService;

    @GetMapping
    @Operation(summary = "계약서 목록 필터+페이징 조회")
    public ResponseEntity<Page<ContractResponse>> getFilteredContracts(
            ContractSearchCondition condition,
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ContractResponse> contracts = contractService.getContractsByFilter(condition, pageable);
        return ResponseEntity.ok(contracts);
    }

    @GetMapping("/{contractId}/conditions")
    @Operation(summary = "특정 계약 조건 상세 보기")
    public ResponseEntity<ContractConditionResponse> getContractConditions(@PathVariable Long contractId) {
        return ResponseEntity.ok(contractService.getContractConditions(contractId));
    }

    @GetMapping("/{contractId}/file")
    @Operation(summary = "계약서 파일 링크 조회")
    public ResponseEntity<String> getContractFileUrl(@PathVariable Long contractId) {
        return ResponseEntity.ok(contractService.getContractFileUrl(contractId));
    }

    @GetMapping("/expiring")
    @Operation(summary = "30일 이내 만료 예정 계약 조회")
    public ResponseEntity<List<ContractResponse>> getExpiringContracts() {
        return ResponseEntity.ok(contractService.getExpiringContracts());
    }

}