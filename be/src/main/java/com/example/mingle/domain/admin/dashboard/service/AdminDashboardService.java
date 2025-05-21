package com.example.mingle.domain.admin.dashboard.service;

import com.example.mingle.domain.admin.dashboard.dto.DashboardSummaryDto;
import com.example.mingle.domain.admin.panel.dto.DashboardActivityDto;
import com.example.mingle.domain.admin.panel.dto.RecentContractDto;
import com.example.mingle.domain.admin.panel.dto.RecentNoticeDto;
import com.example.mingle.domain.admin.panel.dto.RecentSettlementDto;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import com.example.mingle.domain.post.post.entity.NoticeType;
import com.example.mingle.domain.post.post.repository.PostRepository;
import com.example.mingle.domain.user.artist.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ArtistRepository artistRepository;
    private final ContractRepository contractRepository;
    private final SettlementRepository settlementRepository;
    private final PostRepository postRepository;
    // 첫 탭 : 요약
    public DashboardSummaryDto getSummary() {
        long totalArtist = artistRepository.count();
        long draftContracts = contractRepository.countByStatus(ContractStatus.DRAFT);
        long signedContracts = contractRepository.countByStatus(ContractStatus.SIGNED);

        // 변경된 부분: 기간 계산
        LocalDate today = LocalDate.now();
        LocalDate oneWeekLater = today.plusDays(7);
        long expiringContracts = contractRepository.countExpiringContracts(today, oneWeekLater);

        double settlementCompletionRate = settlementRepository.calculateThisMonthCompletionRate();

        return new DashboardSummaryDto(
                totalArtist,
                draftContracts,
                signedContracts,
                expiringContracts,
                settlementCompletionRate
        );

    }

    public DashboardActivityDto getRecentActivities() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        List<RecentContractDto> contracts = contractRepository
                .findByCreatedAtAfterOrderByCreatedAtDesc(oneWeekAgo)
                .stream()
                .map(RecentContractDto::fromEntity)
                .collect(Collectors.toList());

        List<RecentSettlementDto> settlements = settlementRepository
                .findByCreatedAtAfterOrderByCreatedAtDesc(oneWeekAgo)
                .stream()
                .map(RecentSettlementDto::fromEntity)
                .collect(Collectors.toList());

        List<RecentNoticeDto> notices = postRepository
                .findByCreatedAtAfterAndNoticeTypeInOrderByCreatedAtDesc(
                        oneWeekAgo,
                        List.of(NoticeType.GENERAL_NOTICE, NoticeType.COMPANY_NEWS)
                )
                .stream()
                .map(RecentNoticeDto::fromEntity)
                .collect(Collectors.toList());


        return new DashboardActivityDto(contracts, settlements, notices);
    }

    // 두 번째 탭 : 법무


    // 세 번째 탭 : 회계


    // 네 번째 탭 : 인사


    // 다섯 번째 탭 : 기획
}
