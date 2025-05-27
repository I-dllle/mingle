package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.user.user.entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;

public record InternalContractResponse(
        Long id,
        User user,
        BigDecimal defaultRatio,
        ContractStatus status,
        LocalDate startDate,
        LocalDate endDate
) {
    public static InternalContractResponse from(InternalContract c) {
        return new InternalContractResponse(
                c.getId(), c.getUser(),c.getDefaultRatio(), c.getStatus(),
                c.getStartDate(), c.getEndDate()
        );
    }
}


