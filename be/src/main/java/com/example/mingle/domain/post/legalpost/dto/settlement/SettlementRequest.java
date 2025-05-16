package com.example.mingle.domain.post.legalpost.dto.settlement;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class SettlementRequest {
    private BigDecimal totalRevenue;
    private List<CreateSettlementDetailRequest> details; // 배분 대상 목록
}
