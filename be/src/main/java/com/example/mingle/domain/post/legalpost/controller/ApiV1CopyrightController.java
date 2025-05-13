package com.example.mingle.domain.post.legalpost.controller;

import com.example.mingle.domain.post.legalpost.dto.contract.ChangeStatusRequest;
import com.example.mingle.domain.post.legalpost.dto.copyright.CopyrightContractDto;
import com.example.mingle.domain.post.legalpost.dto.copyright.CreateCopyrightContractRequest;
import com.example.mingle.domain.post.legalpost.service.CopyrightService;
import com.example.mingle.global.security.SecurityUser;
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
@RequestMapping("/api/v1/legal/copyrights")
@RequiredArgsConstructor
@PreAuthorize("hasRole('LEGAL')")
public class ApiV1CopyrightController {

    private final CopyrightService copyrightService;

    // 계약서 생성
    @PostMapping(value = "/contracts", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> createContract(
            @RequestPart("request") CreateCopyrightContractRequest request,
            @RequestPart("file") MultipartFile file
    ) throws IOException {
        Long contractId = copyrightService.createContract(request, file);
        return ResponseEntity.ok(contractId);
    }

    // 계약서 상태 변경
    @PutMapping("/contracts/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody ChangeStatusRequest request) {
        copyrightService.changeStatus(id, request.getNextStatus());
        return ResponseEntity.ok("상태 변경 완료");
    }

    // 계약서 서명 (전자)
    @PostMapping("/contracts/{id}/sign")
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public ResponseEntity<?> sign(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUser user
    ) {
        copyrightService.signContract(id, user);
        return ResponseEntity.ok("서명 완료");
    }

    // 계약서 서명 (종이)
    @PostMapping("/contracts/{id}/sign-offline")
    @PreAuthorize("hasRole('USER') or hasRole('ARTIST')")
    public ResponseEntity<?> signOffline(
            @PathVariable Long id,
            @AuthenticationPrincipal SecurityUser user
    ) {
        copyrightService.signOffline(id, user);
        return ResponseEntity.ok("오프라인 서명 완료");
    }


    @GetMapping
    public ResponseEntity<List<CopyrightContractDto>> getAll() {
        return ResponseEntity.ok(copyrightService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CopyrightContractDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(copyrightService.getById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        copyrightService.delete(id);
        return ResponseEntity.ok("삭제 완료");
    }
}
