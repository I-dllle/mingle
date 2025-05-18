package com.example.mingle.domain.post.legalpost.dto.settlement;

import com.example.mingle.domain.post.legalpost.enums.RatioType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record SettlementCreateRequest(
        Long contractExternalId,
        LocalDate incomeDate,
        BigDecimal totalAmount,
        List<SettlementRatioDto> ratios
) {
    public record SettlementRatioDto(
            Long userId,
            Long contractInternalId,
            RatioType ratioType,
            BigDecimal percentage
    ) {}
}