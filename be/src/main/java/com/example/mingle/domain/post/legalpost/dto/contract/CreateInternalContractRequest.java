package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.enums.RatioType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateInternalContractRequest(
        Long userId,
        RatioType ratioType,  // ARTIST, PRODUCER 등
        BigDecimal defaultRatio,
        LocalDate startDate,
        LocalDate endDate,
        Long writerId
) {}
