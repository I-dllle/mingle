package com.example.mingle.domain.post.legalpost.controller;

import com.example.mingle.domain.admin.panel.dto.ContractResponse;
import com.example.mingle.domain.post.legalpost.dto.contract.*;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.InternalContractRepository;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import com.example.mingle.global.security.auth.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
//@PreAuthorize("@authService.isInDepartment(authentication, 3L)") // 부서 ID로 판단
@Tag(name = "legal", description = "법무팀 API")
public class ApiV1LegalController {
    private final ContractService contractService;
    private final ContractRepository contractRepository;
    private final InternalContractRepository internalContractRepository;

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

    @PostMapping(value = "/internal-contracts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "내부 계약 생성 (파일 포함)")
    public ResponseEntity<Long> createInternalContract(
            @RequestPart("request") CreateInternalContractRequest request,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        Long id = contractService.create(request, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 계약서 상태 변경
    @PutMapping("/contracts/{id}/status")
    @Operation(summary = "계약서 상태 변경")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody ChangeStatusRequest request) {
        contractService.changeStatus(id, request.getNextStatus(), request.getCategory());
        return ResponseEntity.ok("상태 변경 완료");
    }

    // 계약서 서명 (전자)
    @PostMapping("/contracts/{id}/sign")
    @PreAuthorize("hasRole('STAFF') or hasRole('ARTIST')")
    @Operation(summary = "계약서 전자 서명")
    public ResponseEntity<String> sign(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUser user
    ) throws IOException{
        String signatureUrl = contractService.signContract(id, user);
        return ResponseEntity.ok(signatureUrl);
    }

    // 계약서 서명 (종이 방식 - 외부 계약자용)
    @PostMapping("/contracts/{id}/sign-offline")
    @Operation(summary = "외부 계약서 종이 서명 처리")
    public ResponseEntity<?> signOfflineAsAdmin(
            @PathVariable Long id,
            @RequestBody OfflineSignRequest request // signerName + memo 포함
    ) {
        contractService.signOfflineAsAdmin(id, request.getSignerName(), request.getMemo());
        return ResponseEntity.ok("오프라인 서명 완료");
    }


    // 특정 유저 계약서 리스트 조회
    @GetMapping("/contracts/by-user")
    @Operation(summary = "특정 유저 계약서 리스트 조회 (내부/외부)")
    public ResponseEntity<List<ContractSimpleDto>> getContractsByUser(
            @RequestParam Long userId,
            @RequestParam ContractCategory category) {

        List<ContractSimpleDto> result;

        if (category == ContractCategory.EXTERNAL) {
            // 작성자 기준이 아닌, 참여자로 조회
            List<Contract> contracts = contractRepository.findByParticipants_IdAndContractCategory(
                    userId, ContractCategory.EXTERNAL
            );
            result = contracts.stream()
                    .map(ContractSimpleDto::from)
                    .toList();
        } else {
            List<InternalContract> internals = internalContractRepository.findByUserId(userId);
            result = internals.stream()
                    .map(ContractSimpleDto::fromInternal)
                    .toList();
        }

        return ResponseEntity.ok(result);
    }

    // 계약 상세 조회
    @GetMapping("/{id}")
    @Operation(summary = "계약서 상세 조회 (내부/외부)")
    public ResponseEntity<ContractDetailDto> getContractDetail(
            @PathVariable Long id,
            @RequestParam ContractCategory category) {

        ContractDetailDto result;

        switch (category) {
            case EXTERNAL -> {
                Contract contract = contractRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("외부 계약을 찾을 수 없습니다."));
                result = ContractDetailDto.from(contract);
            }
            case INTERNAL -> {
                InternalContract internal = internalContractRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("내부 계약을 찾을 수 없습니다."));
                result = ContractDetailDto.fromInternal(internal);
            }
            default -> throw new IllegalArgumentException("지원하지 않는 계약 카테고리입니다.");
        }

        return ResponseEntity.ok(result);
    }


    // 모든 계약서 리스트 조회
    @GetMapping("/contracts")
    @Operation(summary = "모든 계약서 리스트 조회 (내부/외부)")
    public ResponseEntity<List<ContractSimpleDto>> getAllContracts(
            @RequestParam ContractCategory category) {

        List<ContractSimpleDto> result;

        switch (category) {
            case EXTERNAL -> {
                List<Contract> contracts = contractRepository.findAll();
                result = contracts.stream()
                        .map(ContractSimpleDto::from)
                        .toList();
            }
            case INTERNAL -> {
                List<InternalContract> internals = internalContractRepository.findAll();
                result = internals.stream()
                        .map(ContractSimpleDto::fromInternal)
                        .toList();
            }
            default -> throw new IllegalArgumentException("지원하지 않는 계약 카테고리입니다.");
        }

        return ResponseEntity.ok(result);
    }


    // 관리자가 계약서 최종 확정
    @PostMapping("/{id}/confirm")
    @Operation(summary = "계약서 확정")
    public ResponseEntity<Void> confirmContract(@PathVariable Long id, @RequestParam ContractCategory category) {
        contractService.changeStatus(id, ContractStatus.CONFIRMED, category);
        return ResponseEntity.ok().build();
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