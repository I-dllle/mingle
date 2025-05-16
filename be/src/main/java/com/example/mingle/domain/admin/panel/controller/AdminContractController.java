package com.example.mingle.domain.admin.panel.controller;

import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.admin.panel.dto.ContractResponse;
import com.example.mingle.domain.admin.panel.dto.ContractConditionResponse;
import com.example.mingle.domain.admin.panel.service.AdminContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/contracts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminContractController {

    private final AdminContractService adminContractService;

    // 계약서 목록 필터+페이징 조회
    @GetMapping
    public ResponseEntity<Page<ContractResponse>> getFilteredContracts(
            ContractSearchCondition condition,
            @PageableDefault(size = 10, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ContractResponse> contracts = adminContractService.getContractsByFilter(condition, pageable);
        return ResponseEntity.ok(contracts);
    }

    // 특정 계약 조건 상세 보기
    @GetMapping("/{id}/conditions")
    public ResponseEntity<ContractConditionResponse> getContractConditions(@PathVariable Long id) {
        return ResponseEntity.ok(adminContractService.getContractConditions(id));
    }
}