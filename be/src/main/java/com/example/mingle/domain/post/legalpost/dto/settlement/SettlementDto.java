package com.example.mingle.domain.post.legalpost.dto.settlement;

import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SettlementDto(
        Long id,
        BigDecimal amount,
        Boolean isSettled,
        LocalDateTime date,
        String memo
) {
    public static SettlementDto from(Settlement s) {
        return new SettlementDto(
                s.getId(), s.getTotalAmount(), s.getIsSettled(),
                s.getIncomeDate(), s.getMemo()
        );
    }
}
