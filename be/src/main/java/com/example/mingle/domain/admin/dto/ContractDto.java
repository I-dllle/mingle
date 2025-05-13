package com.example.mingle.domain.admin.dto;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ContractDto {
    private Long id;
    private String title;
    private String artistName;
    private LocalDate endDate;

    public static ContractDto from(Contract contract) {
        return ContractDto.builder()
                .id(contract.getId())
                .title(contract.getTitle())
                .artistName(contract.getUser().getName())
                .endDate(contract.getEndDate())
                .build();
    }
}
