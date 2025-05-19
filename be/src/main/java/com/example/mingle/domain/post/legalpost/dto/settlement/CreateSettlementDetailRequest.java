package com.example.mingle.domain.post.legalpost.dto.settlement;

import com.example.mingle.domain.post.legalpost.enums.RatioType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateSettlementDetailRequest {
    private Long userId;              // 회사 몫일 경우 null
    private RatioType ratioType;      // AGENCY, ARTIST, PRODUCER 등
    private BigDecimal percentage;    // 50.0 등
}