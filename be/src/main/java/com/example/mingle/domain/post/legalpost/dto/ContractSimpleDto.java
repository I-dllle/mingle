package com.example.mingle.domain.post.legalpost.dto;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import lombok.Getter;
import lombok.Setter;

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
                c.getContractId(), c.getSummary(), c.getStatus(),
                c.getStartDate(), c.getEndDate()
        );
    }
}
