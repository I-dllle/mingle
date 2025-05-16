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
public class ContractConditionResponse {
    private String title;
    private String userName;
    private String teamName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String summary;
    private String companyName;
    private String fileUrl;
    private ContractStatus status;
    private ContractType contractType;
    private ContractCategory contractCategory;
    private Boolean isSettlementCreated;
    private String signerName;
    private String signerMemo;
    private boolean isTerminated;

    public static ContractConditionResponse from(Contract contract) {
        return ContractConditionResponse.builder()
                .title(contract.getTitle())
                .userName(contract.getUser().getName())
                .teamName(contract.getTeam() != null ? contract.getTeam().getName() : null)
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .summary(contract.getSummary())
                .companyName(contract.getCompanyName())
                .fileUrl(contract.getFileUrl())
                .status(contract.getStatus())
                .contractType(contract.getContractType())
                .contractCategory(contract.getContractCategory())
                .isSettlementCreated(contract.getIsSettlementCreated())
                .signerName(contract.getSignerName())
                .signerMemo(contract.getSignerMemo())
                .isTerminated(contract.getEndDate().isBefore(LocalDate.now()))
                .build();
    }
}
