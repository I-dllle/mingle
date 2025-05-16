package com.example.mingle.domain.admin.Revenue;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/revenue")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRevenueController {
    private final RevenueService revenueService;

    @GetMapping
    public ResponseEntity<RevenueStatsResponse> getRevenue(@RequestParam Long artistId) {
        return ResponseEntity.ok(revenueService.getArtistRevenue(artistId));
    }
}