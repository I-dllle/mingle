package com.example.mingle.domain.admin.panel.controller;

import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.admin.panel.dto.ContractResponse;
import com.example.mingle.domain.admin.panel.dto.ContractConditionResponse;
import com.example.mingle.domain.admin.panel.dto.InternalSearchCondition;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/contracts")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "AdminContract", description = "관리자 전용 계약서 관리 API")
public class ApiV1AdminContractController {

    private final ContractService contractService;

    @GetMapping
    @Operation(summary = "계약서 목록 필터+페이징 조회")
    public ResponseEntity<Page<ContractResponse>> getFilteredContracts(

            InternalSearchCondition searchCondition,
            ContractSearchCondition condition,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ContractResponse> contracts = contractService.getContractsByFilter(condition, searchCondition, pageable);
        return ResponseEntity.ok(contracts);
    }

    @GetMapping("/{contractId}/conditions")
    @Operation(summary = "특정 계약 조건 상세 보기")
    public ResponseEntity<ContractConditionResponse> getContractConditions(@PathVariable Long contractId) {
        return ResponseEntity.ok(contractService.getContractConditions(contractId));
    }

    @GetMapping("/contracts/{id}/file-url")
    @Operation(summary = "계약서 파일 URL 조회 (내부/외부)")
    public ResponseEntity<String> getContractFileUrl(
            @PathVariable Long id,
            @RequestParam ContractCategory category) {
        String url = contractService.getContractFileUrl(id, category);
        return ResponseEntity.ok(url);
    }

    @GetMapping("/contracts/expiring")
    @Operation(summary = "만료 예정 계약 조회 (내부/외부)")
    public ResponseEntity<List<ContractResponse>> getExpiringContracts(
            @RequestParam ContractCategory category) {
        return ResponseEntity.ok(contractService.getExpiringContracts(category));
    }
}