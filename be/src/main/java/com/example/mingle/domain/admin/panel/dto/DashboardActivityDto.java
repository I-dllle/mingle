package com.example.mingle.domain.admin.panel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class DashboardActivityDto {
    private List<RecentContractDto> recentContracts;
    private List<RecentSettlementDto> recentSettlements;
    private List<RecentNoticeDto> recentNotices;
}
