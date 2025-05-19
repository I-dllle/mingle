package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class RecentContractDto {
    private Long id;
    private String nickName;
    private LocalDate startDate;
    private ContractStatus status;

    public static RecentContractDto fromEntity(Contract contract) {
        return RecentContractDto.builder()
                .id(contract.getId())
                .nickName(contract.getUser().getNickname())
                .startDate(contract.getStartDate())
                .status(contract.getStatus())
                .build();
    }
}
