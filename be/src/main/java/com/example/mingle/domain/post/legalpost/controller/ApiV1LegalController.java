package com.example.mingle.domain.post.legalpost.controller;

import com.docusign.esign.client.ApiException;
import com.example.mingle.domain.post.legalpost.dto.contract.*;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import com.example.mingle.global.security.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/legal")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "legal", description = "법무팀 API")
public class ApiV1LegalController {
    private final ContractService contractService;
    private final ContractRepository contractRepository;

    // 계약서 생성
    @PostMapping(value = "/contracts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "계약서 생성")
    public ResponseEntity<Long> createContract(
            @RequestPart("request") CreateContractRequest request,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        Long contractId = contractService.createContract(request, file);
        return ResponseEntity.ok(contractId);
    }

    // 계약서 상태 변경
    @PutMapping("/contracts/{id}/status")
    @Operation(summary = "계약서 상태 변경")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody ChangeStatusRequest request) {
        contractService.changeStatus(id, request.getNextStatus());
        return ResponseEntity.ok("상태 변경 완료");
    }

    // 계약서 서명 (전자)
    @PostMapping("/contracts/{id}/sign")
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    @Operation(summary = "계약서 전자 서명")
    public ResponseEntity<String> sign(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUser user
    ) throws IOException, ApiException {
        String signatureUrl = contractService.signContract(id, user);
        return ResponseEntity.ok(signatureUrl);
    }

    // 계약서 서명 (종이)
    @PostMapping("/contracts/{id}/sign-offline")
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    @Operation(summary = "계약서 종이 서명")
    public ResponseEntity<?> signOffline(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUser user
    ) throws IOException{
        contractService.signOffline(id, user);
        return ResponseEntity.ok("오프라인 서명 완료");
    }


    // 특정 유저 계약서 리스트 조회
    @GetMapping("/contracts/by-user")
    @Operation(summary = "특정 유저 계약서 리스트 조회")
    public ResponseEntity<List<ContractSimpleDto>> getContractsByUser(@RequestParam Long userId) {
        List<Contract> contracts = contractRepository.findByUserId(userId);
        List<ContractSimpleDto> result = contracts.stream()
                .map(ContractSimpleDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

    // 계약 상세 조회
    @GetMapping("/{id}")
    @Operation(summary = "계약서 상세 조회")
    public ResponseEntity<ContractDetailDto> getContractDetail(@PathVariable Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("계약을 찾을 수 없습니다."));
        return ResponseEntity.ok(ContractDetailDto.from(contract));
    }

    // 모든 계약서 리스트 조회
    @GetMapping("/contracts")
    @Operation(summary = "모든 계약서 리스트 조회")
    public ResponseEntity<List<ContractSimpleDto>> getAllContracts() {
        List<Contract> contracts = contractRepository.findAll();
        List<ContractSimpleDto> result = contracts.stream()
                .map(ContractSimpleDto::from)
                .toList();
        return ResponseEntity.ok(result);
    }

}