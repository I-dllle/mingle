package com.example.mingle.domain.post.legalpost.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SettlementRequest {
    private BigDecimal totalRevenue;
}
