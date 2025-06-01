package com.example.mingle.domain.post.legalpost.service;

import com.example.mingle.domain.post.legalpost.dto.settlement.*;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.entity.SettlementDetail;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;
import com.example.mingle.domain.post.legalpost.enums.SettlementStatus;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementDetailRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRatioRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class SettlementService {
    private final ContractRepository contractRepository;
    private final SettlementRatioRepository ratioRepository;
    private final SettlementRepository settlementRepository;
    private final SettlementDetailRepository settlementDetailRepository;

    public void createSettlement(Long contractId)
    {
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("계약을 찾을 수 없습니다."));

        if (contract.getStatus() != ContractStatus.CONFIRMED) {
            throw new IllegalStateException("확정된 계약만 정산할 수 있습니다.");
        }

        BigDecimal totalRevenue = contract.getContractAmount();
        // 1. 수익 단위 Settlement 생성
        Settlement settlement = Settlement.builder()
                .contract(contract)
                .incomeDate(LocalDateTime.now())
                .totalAmount(totalRevenue)
                .memo("정산 생성: " + contract.getSummary())
                .status(SettlementStatus.ACTIVE)
                .isSettled(false)
                .build();

        settlementRepository.save(settlement);

        // 2. 비율 기준으로 상세 정산 생성
        List<SettlementRatio> ratios = ratioRepository.findByContract(contract);

        for (SettlementRatio ratio : ratios) {
            BigDecimal amount = totalRevenue.multiply(ratio.getPercentage())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            SettlementDetail detail = SettlementDetail.builder()
                    .settlement(settlement)
                    .user(ratio.getRatioType() == RatioType.AGENCY ? null : ratio.getUser()) // 회사는 유저 없을 수 있음
                    .ratioType(ratio.getRatioType())
                    .percentage(ratio.getPercentage())
                    .amount(amount)
                    .status(SettlementStatus.ACTIVE)
                    .build();

            settlementDetailRepository.save(detail);
        }

        contractRepository.save(contract);
    }

    public void updateSettlement(Long id, UpdateSettlementRequest request) {
        Settlement settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("정산 내역을 찾을 수 없습니다."));

        Contract contract = settlement.getContract();

        settlement.setTotalAmount(request.getTotalAmount());
        settlement.setMemo(request.getMemo());
        settlement.setIsSettled(request.getIsSettled());
        settlement.setIncomeDate(request.getIncomeDate());
        settlement.setSource(request.getSource());

        settlementDetailRepository.deleteBySettlementId(settlement.getId());

        List<SettlementRatio> ratios = ratioRepository.findByContract(contract);
        BigDecimal totalRevenue = request.getTotalAmount();

        for (SettlementRatio ratio : ratios) {
            BigDecimal amount = totalRevenue.multiply(ratio.getPercentage())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            SettlementDetail detail = SettlementDetail.builder()
                    .settlement(settlement)
                    .user(ratio.getRatioType() == RatioType.AGENCY ? null : ratio.getUser())
                    .ratioType(ratio.getRatioType())
                    .percentage(ratio.getPercentage())
                    .amount(amount)
                    .build();

            settlementDetailRepository.save(detail);
        }

        settlementRepository.save(settlement);
    }



    @Transactional
    public void deleteSettlement(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new EntityNotFoundException("정산 내역을 찾을 수 없습니다."));

        // 상위 Settlement 상태 변경
        settlement.setStatus(SettlementStatus.DELETED);

        // 하위 SettlementDetail 모두 상태 변경
        List<SettlementDetail> details = settlementDetailRepository.findAllBySettlement(settlement);
        for (SettlementDetail detail : details) {
            detail.setStatus(SettlementStatus.DELETED);
        }
    }


    public void updateIsSettled(Long id, Boolean isSettled) {
        Settlement settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("정산 내역을 찾을 수 없습니다."));
        settlement.setIsSettled(isSettled);
        settlementRepository.save(settlement);
    }


    public SettlementSummaryDto getSummary() {
        List<Settlement> settlements = settlementRepository.findAll();
        BigDecimal totalAmount = settlements.stream()
                .map(Settlement::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SettlementSummaryDto(totalAmount, settlements.size());
    }

    public Page<SettlementDto> getAllSettlements(Pageable pageable) {
        return settlementRepository.findAllExcludingStatus(SettlementStatus.DELETED, pageable)
                .map(SettlementDto::from);
    }


    public BigDecimal getTotalRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        SettlementStatus excluded = SettlementStatus.DELETED;
        if (startDate != null && endDate != null) {
            return settlementRepository.getTotalRevenueBetweenExcludingStatus(startDate, endDate, excluded)
                    .orElse(BigDecimal.ZERO);
        } else {
            return settlementRepository.getTotalRevenueExcludingStatus(excluded)
                    .orElse(BigDecimal.ZERO);
        }
    }


    public BigDecimal getTotalRevenueByUser(Long userId) {
        return settlementDetailRepository.getTotalRevenueByUser(userId, SettlementStatus.DELETED);
    }

    public BigDecimal getAgencyRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        RatioType ratioType = RatioType.AGENCY;
        SettlementStatus excludedStatus = SettlementStatus.DELETED;

        if (startDate != null && endDate != null) {
            return settlementDetailRepository.calculateTotalByRatioTypeAndDateRange(
                    ratioType, excludedStatus, startDate, endDate
            ).orElse(BigDecimal.ZERO);
        } else {
            return settlementDetailRepository.calculateTotalByRatioType(
                    ratioType, excludedStatus
            ).orElse(BigDecimal.ZERO);
        }
    }

    public Map<YearMonth, BigDecimal> getMonthlyRevenueSummary() {
        List<Object[]> rows = settlementDetailRepository.findMonthlyRevenueSummary(SettlementStatus.DELETED);

        Map<YearMonth, BigDecimal> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            String monthStr = (String) row[0]; // 예: "2024-05"
            BigDecimal amount = (BigDecimal) row[1];
            YearMonth ym = YearMonth.parse(monthStr);
            result.put(ym, amount);
        }
        return result;
    }

    public List<ArtistRevenueDto> getTopArtistsByRevenue(int limit) {
        List<Object[]> rows = settlementDetailRepository.findTopArtistRevenue(SettlementStatus.DELETED);

        return rows.stream()
                .limit(limit)
                .map(row -> ArtistRevenueDto.builder()
                        .artistId((Long) row[0])
                        .artistName((String) row[1])
                        .totalRevenue((BigDecimal) row[2])
                        .build())
                .toList();
    }

    public Map<RatioType, BigDecimal> getRevenueByRatioType() {
        List<Object[]> rows = settlementDetailRepository.getRevenueGroupedByRatioType();

        Map<RatioType, BigDecimal> result = new EnumMap<>(RatioType.class);
        for (Object[] row : rows) {
            RatioType type = (RatioType) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            result.put(type, amount);
        }
        return result;
    }


    public BigDecimal getRevenueByContract(Long contractId) {
        BigDecimal result = settlementDetailRepository.getTotalRevenueByContract(contractId, SettlementStatus.DELETED);
        return result != null ? result : BigDecimal.ZERO;
    }


    public List<SettlementDetailResponse> getSettlementDetailsByContract(Long contractId) {
        List<SettlementDetail> details = settlementDetailRepository.findAllByContractId(contractId);
        return details.stream()
                .map(SettlementDetailResponse::from)
                .toList();
    }

    public BigDecimal getMonthlyTotalRevenue() {
        YearMonth now = YearMonth.now();
        LocalDate start = now.atDay(1);
        LocalDate end = now.atEndOfMonth();
        return settlementRepository.getTotalRevenueBetween(start, end)
                .orElse(BigDecimal.ZERO);
    }

}
