package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;

import java.time.LocalDate;

public record ContractSimpleDto(
        Long id,
        String summary,
        ContractStatus status,
        LocalDate startDate,
        LocalDate endDate
) {
    public static ContractSimpleDto from(Contract c) {
        return new ContractSimpleDto(
                c.getId(), c.getSummary(), c.getStatus(),
                c.getStartDate(), c.getEndDate()
        );
    }
}
