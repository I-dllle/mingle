package com.example.mingle.domain.admin.panel.controller;

import com.example.mingle.domain.post.legalpost.dto.settlement.SettlementDto;
import com.example.mingle.domain.post.legalpost.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/settlements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettlementController {
    private final SettlementService settlementService;

    @GetMapping
    public ResponseEntity<List<SettlementDto>> getAll() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }
}