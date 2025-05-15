package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
public class CreateContractRequest {
    private Long userId;
    private Long teamId;
    private String title;
    private String companyName;
    private String summary;
    private ContractType contractType;
    private ContractCategory contractCategory;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal settlementRatio; // 1명 기준
}