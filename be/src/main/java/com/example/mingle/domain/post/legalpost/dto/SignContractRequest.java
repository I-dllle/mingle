package com.example.mingle.domain.post.legalpost.dto;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class SignContractRequest {
    private String signerName;
    private String signerMemo;
    private BigDecimal totalRevenue;
}