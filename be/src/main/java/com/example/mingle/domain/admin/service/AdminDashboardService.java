package com.example.mingle.domain.admin.service;

import com.example.mingle.domain.admin.dto.DashboardSummaryDto;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import com.example.mingle.domain.user.artist.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ArtistRepository artistRepository;
    private final ContractRepository contractRepository;
    private final SettlementRepository settlementRepository;

    // 첫 탭 : 요약
    public DashboardSummaryDto getSummary() {
        long totalArtist = artistRepository.count();
        long draftContracts = contractRepository.countByStatus(ContractStatus.DRAFT);
        long signedContracts = contractRepository.countByStatus(ContractStatus.SIGNED);
        long expiringContracts = contractRepository.countExpiringContracts(); // 커스텀 쿼리 필요
        double settlementCompletionRate = settlementRepository.calculateThisMonthCompletionRate(); // 커스텀 로직

        return new DashboardSummaryDto(
                totalArtist,
                draftContracts, signedContracts, expiringContracts,
                settlementCompletionRate
        );
    }

    // 두 번째 탭 : 법무


    // 세 번째 탭 : 회계


    // 네 번째 탭 : 인사


    // 다섯 번째 탭 : 기획
}
