package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class InternalSearchCondition {
    private Long teamId;
    private ContractStatus status;
    private ContractType contractType;
    private ContractCategory contractCategory;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private Long UserId; // 사용자 ID로 변경
}
