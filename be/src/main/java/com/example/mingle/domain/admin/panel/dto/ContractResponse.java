package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

public record ContractResponse(
        Long id,
        String title,
        String userName,
        String teamName,
        String companyName,
        LocalDate startDate,
        LocalDate endDate,
        ContractStatus status,
        ContractCategory contractCategory,
        ContractType contractType
) {
    public static ContractResponse from(Contract contract) {
        return new ContractResponse(
                contract.getId(),
                contract.getTitle(),
                contract.getUser().getName(),
                contract.getTeam() != null ? contract.getTeam().getName() : null,
                contract.getCompanyName(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getStatus(),
                contract.getContractCategory(),
                contract.getContractType()
        );
    }

    public static ContractResponse fromInternal(InternalContract contract) {
        return new ContractResponse(
                contract.getId(),
                contract.getTitle(),
                contract.getUser().getName(),
                "team",
                "mingle",
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getStatus(),
                ContractCategory.valueOf("INTERNAL"),
                ContractType.valueOf("ELECTRONIC")
        );
    }
}
