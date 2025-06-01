package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.InternalContract;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.user.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class ContractSimpleDto {
    private Long id;
    private String title;
    private String companyName; // 회사명 (계약 당사자)
    private ContractStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String nickname;
    private ContractCategory category;

    public static ContractSimpleDto from(Contract contract) {
        return new ContractSimpleDto(
                contract.getId(),
                contract.getTitle(),
                contract.getCompanyName(),
                contract.getStatus(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getUser().getNickname(),
                contract.getContractCategory()
        );
    }

    public static ContractSimpleDto fromInternal(InternalContract internal) {
        return new ContractSimpleDto(
                internal.getId(),
                "(내부계약) 사용자 정산 계약",
                "Mingle",
                internal.getStatus(),
                internal.getStartDate(),
                internal.getEndDate(),
                internal.getUser().getNickname(),
                ContractCategory.INTERNAL
        );
    }
}