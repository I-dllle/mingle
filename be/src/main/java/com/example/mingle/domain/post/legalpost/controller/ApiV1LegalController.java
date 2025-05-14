package com.example.mingle.domain.post.legalpost.controller;

import com.example.mingle.domain.post.legalpost.dto.*;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import com.example.mingle.domain.post.legalpost.service.SettlementService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/legal")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LEGAL')")
@Tag(name = "legal", description = "법무팀 API")
public class ApiV1LegalController {
    private final ContractService contractService;
    private final SettlementService settlementService;
    private final ContractRepository contractRepository;
    private final SettlementRepository settlementRepository;

    // 계약서 생성
    @PostMapping("/contract")
    public ResponseEntity<Long> createContract(@RequestBody CreateContractRequest request) {
        Long contractId = contractService.createContract(request);
        return ResponseEntity.ok(contractId);
    }

    // 계약서 상태 변경
    @PutMapping("/contracts/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody ChangeStatusRequest request) {
        contractService.changeStatus(id, request.getNextStatus());
        return ResponseEntity.ok("상태 변경 완료");
    }

    // 계약서 서명
    @PostMapping("/contracts/{id}/sign")
    public ResponseEntity<?> sign(@PathVariable Long id, @RequestBody SignContractRequest request) {
        contractService.signContract(id, request);
        return ResponseEntity.ok("서명 완료");
    }

    // 특정 유저 계약서 리스트 조회
    @GetMapping("/contracts/by-user")
    public ResponseEntity<List<ContractSimpleDto>> getContractsByUser(@RequestParam Long userId) {
        List<Contract> contracts = contractRepository.findByUserId(userId);
        List<ContractSimpleDto> result = contracts.stream()
                .map(ContractSimpleDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    // 계약 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ContractDetailDto> getContractDetail(@PathVariable Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("계약을 찾을 수 없습니다."));
        return ResponseEntity.ok(ContractDetailDto.from(contract));
    }

    // 모든 계약서 리스트 조회
    @GetMapping("/contracts")
    public ResponseEntity<List<ContractSimpleDto>> getAllContracts() {
        List<Contract> contracts = contractRepository.findAll();
        List<ContractSimpleDto> result = contracts.stream()
                .map(ContractSimpleDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

}