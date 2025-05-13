package com.example.mingle.domain.post.legalpost.dto;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;

import java.time.LocalDate;

public record ContractDetailDto(
        Long id,
        String summary,
        String signerName,
        String signerMemo,
        ContractStatus status,
        LocalDate startDate,
        LocalDate endDate,
        String fileUrl
) {
    public static ContractDetailDto from(Contract c) {
        return new ContractDetailDto(
                c.getContractId(), c.getSummary(), c.getSignerName(), c.getSignerMemo(),
                c.getStatus(), c.getStartDate(), c.getEndDate(), c.getFileUrl()
        );
    }
}
