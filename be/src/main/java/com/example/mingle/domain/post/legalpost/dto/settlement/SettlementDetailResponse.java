package com.example.mingle.domain.post.legalpost.dto.settlement;

import com.example.mingle.domain.post.legalpost.entity.SettlementDetail;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.user.user.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.Optional;

@Getter
@Builder
public class SettlementDetailResponse {
    private Long settlementId;
    private Long userId;
    private BigDecimal amount;
    private BigDecimal percentage;
    private RatioType ratioType;

    public static SettlementDetailResponse from(SettlementDetail sd) {
        return SettlementDetailResponse.builder()
                .settlementId(sd.getSettlement().getId())
                .userId(Optional.ofNullable(sd.getUser()).map(User::getId).orElse(null))
                .amount(sd.getAmount())
                .percentage(sd.getPercentage())
                .ratioType(sd.getRatioType())
                .build();
    }
}
