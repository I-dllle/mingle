package com.example.mingle.domain.post.legalpost.dto.settlement;

import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SettlementDto(
        Long id,
        BigDecimal amount,
        Boolean isSettled,
        LocalDate date,
        String memo,
        SettlementCategory category
) {
    public static SettlementDto from(Settlement s) {
        return new SettlementDto(
                s.getId(), s.getAmount(), s.getIsSettled(),
                s.getDate(), s.getMemo(), s.getCategory()
        );
    }
}
