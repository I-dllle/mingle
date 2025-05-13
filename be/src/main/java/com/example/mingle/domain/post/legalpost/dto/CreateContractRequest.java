package com.example.mingle.domain.post.legalpost.dto;

import com.example.mingle.domain.post.legalpost.enums.ContractType;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
public class CreateContractRequest {
    private Long userId;
    private Long teamId;
    private String summary;
    private ContractType contractType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal settlementRatio; // 1명 기준
}