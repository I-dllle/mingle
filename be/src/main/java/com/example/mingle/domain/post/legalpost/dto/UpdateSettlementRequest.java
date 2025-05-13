package com.example.mingle.domain.post.legalpost.dto;

import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter
public class UpdateSettlementRequest {
    private BigDecimal amount;
    private String memo;
    private Boolean isSettled;
    private SettlementCategory category;
    private LocalDate date;
}