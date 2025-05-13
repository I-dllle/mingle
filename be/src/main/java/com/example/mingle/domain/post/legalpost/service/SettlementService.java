package com.example.mingle.domain.post.legalpost.service;

import com.example.mingle.domain.post.legalpost.dto.settlement.SettlementSummaryDto;
import com.example.mingle.domain.post.legalpost.dto.settlement.UpdateSettlementRequest;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRatioRepository;
import com.example.mingle.domain.post.legalpost.repository.SettlementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettlementService {
    private final ContractRepository contractRepository;
    private final SettlementRatioRepository ratioRepository;
    private final SettlementRepository settlementRepository;

    public void createSettlement(Long contractId, BigDecimal totalRevenue) {
        Contract contract = contractRepository.findById(contractId).orElseThrow();

        if (contract.getStatus() != ContractStatus.CONFIRMED) {
            throw new IllegalStateException("확정된 계약만 정산 가능");
        }

        if (contract.getIsSettlementCreated()) {
            throw new IllegalStateException("이미 정산이 생성됨");
        }

        List<SettlementRatio> ratios = ratioRepository.findByContract(contract);
        for (SettlementRatio ratio : ratios) {
            BigDecimal amount = totalRevenue.multiply(ratio.getPercentage())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

            Settlement s = Settlement.builder()
                    .user(contract.getUser())
                    .amount(amount)
                    .date(LocalDate.now())
                    .category(SettlementCategory.계약)
                    .memo(contract.getSummary())
                    .contract(contract)
                    .isSettled(false)
                    .build();

            settlementRepository.save(s);
        }

        contract.setIsSettlementCreated(true);
        contractRepository.save(contract);
    }

    public void updateSettlement(Long id, UpdateSettlementRequest request) {
        Settlement settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("정산 내역을 찾을 수 없습니다."));

        settlement.setAmount(request.getAmount());
        settlement.setMemo(request.getMemo());
        settlement.setIsSettled(request.getIsSettled());
        settlement.setCategory(request.getCategory());
        settlement.setDate(request.getDate());

        settlementRepository.save(settlement);
    }

    public void deleteSettlement(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new EntityNotFoundException("정산 내역을 찾을 수 없습니다."));
        settlementRepository.delete(settlement);
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
                .map(Settlement::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SettlementSummaryDto(totalAmount, settlements.size());
    }

}
