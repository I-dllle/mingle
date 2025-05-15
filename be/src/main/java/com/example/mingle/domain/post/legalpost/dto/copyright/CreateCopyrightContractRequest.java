package com.example.mingle.domain.post.legalpost.dto.copyright;

import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.CopyrightType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class CreateCopyrightContractRequest {
    private Long userId;
    private Long teamId;
    private String contentTitle;
    private String title;
    private String companyName;
    private CopyrightType copyrightType;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal sharePercentage;
    private String fileUrl;
    private String summary;
    private ContractType contractType;
    private String signerName;
    private String signerMemo;
    private BigDecimal settlementRatio;
}
