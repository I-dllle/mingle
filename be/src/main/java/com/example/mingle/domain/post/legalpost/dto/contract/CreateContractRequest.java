package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


public record CreateContractRequest(
        Long userId,
        Long teamId,
        String counterpartyCompanyName,
        String summary,
        String title,
        ContractCategory contractCategory,
        LocalDate startDate,
        LocalDate endDate,
        ContractType contractType,
        BigDecimal contractAmount,
        boolean useManualRatios, // 👈 true면 수동 입력, false면 내부계약 기준
        List<SettlementRatioDto> ratios, // 수동 입력용
        List<Long> targetUserIds         // 내부계약 기준 유저 ID 리스트
) {
    public record SettlementRatioDto(
            RatioType ratioType,
            Long userId,
            BigDecimal percentage
    ) {}
}