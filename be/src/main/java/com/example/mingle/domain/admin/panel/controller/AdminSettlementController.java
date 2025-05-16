package com.example.mingle.domain.admin.settlement;

import com.example.mingle.domain.post.legalpost.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/settlements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettlementController {
    private final SettlementService settlementService;

    @GetMapping
    public ResponseEntity<List<SettlementResponse>> getAll() {
        return ResponseEntity.ok(settlementService.getAllSettlements());
    }
}