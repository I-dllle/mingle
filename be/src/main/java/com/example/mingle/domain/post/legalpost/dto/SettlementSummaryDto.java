package com.example.mingle.domain.post.legalpost.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class SettlementSummaryDto {
    private BigDecimal totalAmount;
    private int count;
}
