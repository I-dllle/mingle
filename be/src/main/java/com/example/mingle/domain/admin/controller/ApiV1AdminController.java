package com.example.mingle.domain.admin.controller;

import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ApiV1AdminController {
    private final ContractService contractService;

    // 관리자가 계약서 최종 확정
    @PostMapping("/{id}/confirm")
    public ResponseEntity<Void> confirmContract(@PathVariable Long id) {
        contractService.changeStatus(id, ContractStatus.CONFIRMED);
        return ResponseEntity.ok().build();
    }


}
