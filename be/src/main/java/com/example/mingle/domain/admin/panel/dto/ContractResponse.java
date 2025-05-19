package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ContractResponse {
    private Long id;
    private String title;
    private String userName;      // 계약 당사자 이름
    private String teamName;      // 팀 이름 (nullable 가능성 있음)
    private String companyName;   // 회사명
    private LocalDate startDate;
    private LocalDate endDate;
    private ContractStatus status;
    private ContractCategory contractCategory;
    private ContractType contractType;

    public static ContractResponse from(Contract contract) {
        return ContractResponse.builder()
                .id(contract.getId())
                .title(contract.getTitle())
                .userName(contract.getUser().getName())
                .teamName(contract.getTeam() != null ? contract.getTeam().getName() : null)
                .companyName(contract.getCompanyName())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .status(contract.getStatus())
                .contractCategory(contract.getContractCategory())
                .contractType(contract.getContractType())
                .build();
    }
}
