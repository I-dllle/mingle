package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ContractSimpleDto {
    private Long id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private ContractCategory category;

    public static ContractSimpleDto from(Contract contract) {
        return new ContractSimpleDto(
                contract.getId(),
                contract.getTitle(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getContractCategory()
        );
    }

    public static ContractSimpleDto fromInternal(InternalContract internal) {
        return new ContractSimpleDto(
                internal.getId(),
                "(내부계약) 사용자 정산 계약",
                internal.getStartDate(),
                internal.getEndDate(),
                ContractCategory.INTERNAL
        );
    }
}