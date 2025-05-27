package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.RatioType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record UpdateContractRequest(
        String title,
        String summary,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal contractAmount,
        ContractCategory contractCategory,
        ContractType contractType,
        ContractStatus status,
        boolean useManualRatios,
        List<SettlementRatioDto> ratios,
        List<Long> targetUserIds
) {
    public record SettlementRatioDto(
            Long userId,
            RatioType ratioType,
            BigDecimal percentage
    ) {}
}
