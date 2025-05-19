package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.post.legalpost.entity.Settlement;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class RecentSettlementDto {
    private Long id;
    private LocalDate incomeDate;
    private BigDecimal totalAmount;
    private String memo;

    public static RecentSettlementDto fromEntity(Settlement settlement) {
        return RecentSettlementDto.builder()
                .id(settlement.getId())
                .incomeDate(settlement.getIncomeDate())
                .totalAmount(settlement.getTotalAmount())
                .memo(settlement.getMemo())
                .build();
    }
}
