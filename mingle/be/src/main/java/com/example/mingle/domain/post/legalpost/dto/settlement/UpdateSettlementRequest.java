package com.example.mingle.domain.post.legalpost.dto.settlement;

import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
public class UpdateSettlementRequest {
    private BigDecimal totalAmount;
    private String memo;
    private Boolean isSettled;
    private String source;
    private LocalDateTime IncomeDate;
}