package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ContractResponseEndDaate {
    private Long id;
    private String title;
    private String userName;
    private String teamName;
    private LocalDate startDate;
    private LocalDate endDate;
    private ContractStatus status;

    public static ContractResponseEndDaate from(Contract c) {
        return ContractResponseEndDaate.builder()
                .id(c.getId())
                .title(c.getTitle())
                .userName(c.getUser().getName())
                .teamName(c.getTeam() != null ? c.getTeam().getName() : null)
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .status(c.getStatus())
                .build();
    }
}
