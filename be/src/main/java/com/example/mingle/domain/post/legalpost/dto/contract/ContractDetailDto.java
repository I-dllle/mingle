package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
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
                c.getId(), c.getSummary(), c.getSignerName(), c.getSignerMemo(),
                c.getStatus(), c.getStartDate(), c.getEndDate(), c.getFileUrl()
        );
    }

    public static ContractDetailDto fromInternal(InternalContract c) {
        return new ContractDetailDto(
                c.getId(), "요약", c.getSignerName(), c.getSignerMemo(),
                c.getStatus(), c.getStartDate(), c.getEndDate(), c.getFileUrl()
        );
    }
}
