//package com.example.mingle.domain.admin.dashboard.controller;
//
//import com.example.mingle.domain.admin.dashboard.dto.DashboardSummaryDto;
//import com.example.mingle.domain.admin.dashboard.service.AdminDashboardService;
////import com.example.mingle.domain.admin.dashboard.service.LegalDashboardService;
//import com.example.mingle.domain.post.legalpost.service.ContractService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/v1/admin/dashboard")
//@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
//public class AdminDashboardController {
//    private final DashboardService dashboardService;
//
//    @GetMapping("/content")
//    public ResponseEntity<ContentStatsResponse> getContentStats() {
//        return ResponseEntity.ok(dashboardService.getContentStats());
//    }
//
//    @GetMapping("/artist")
//    public ResponseEntity<ArtistStatsResponse> getArtistStats() {
//        return ResponseEntity.ok(dashboardService.getArtistStats());
//    }
//
//    @GetMapping("/contract")
//    public ResponseEntity<ContractStatsResponse> getContractStats() {
//        return ResponseEntity.ok(dashboardService.getContractStats());
//    }
//
//    @GetMapping("/revenue")
//    public ResponseEntity<RevenueStatsResponse> getRevenueStats() {
//        return ResponseEntity.ok(dashboardService.getRevenueStats());
//    }
//
//    @GetMapping("/contract-expiring")
//    public ResponseEntity<List<ExpiringContractAlertResponse>> getExpiringContracts() {
//        return ResponseEntity.ok(dashboardService.getExpiringContracts());
//    }
//}
