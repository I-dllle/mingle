package com.example.mingle.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardSummaryDto {
    private long totalArtists;
    private long draftContracts;
    private long signedContracts;
    private long expiringContracts;
    private double settlementCompletionRate;
}
