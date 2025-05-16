package com.example.mingle.domain.post.legalpost.dto.settlement;

import com.example.mingle.domain.post.legalpost.entity.SettlementDetail;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class SettlementDetailResponse {
    private Long settlementId;
    private Long userId;
    private String userName;
    private BigDecimal amount;
    private BigDecimal percentage;
    private RatioType ratioType;

    public static SettlementDetailResponse from(SettlementDetail sd) {
        return SettlementDetailResponse.builder()
                .settlementId(sd.getSettlement().getId())
                .userId(sd.getUser().getId())
                .userName(sd.getUser().getName()) // 또는 nickname
                .amount(sd.getAmount())
                .percentage(sd.getPercentage())
                .ratioType(sd.getRatioType())
                .build();
    }
}
