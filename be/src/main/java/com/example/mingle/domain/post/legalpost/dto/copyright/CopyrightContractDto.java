package com.example.mingle.domain.post.legalpost.dto.copyright;

import com.example.mingle.domain.post.legalpost.entity.CopyrightContract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.CopyrightType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class CopyrightContractDto {
    private Long id;
    private String contentTitle;
    private String userName;
    private CopyrightType copyrightType;
    private BigDecimal sharePercentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private ContractStatus status;

    public static CopyrightContractDto from(CopyrightContract contract) {
        return CopyrightContractDto.builder()
                .id(contract.getCopyrightContractId())
                .contentTitle(contract.getContentTitle())
                .userName(contract.getUser().getName())
                .copyrightType(contract.getCopyrightType())
                .sharePercentage(contract.getSharePercentage())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .status(contract.getStatus())
                .build();
    }
}
