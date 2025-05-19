package com.example.mingle.domain.post.legalpost.dto.contract;

import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import lombok.Getter;

@Getter
public class ChangeStatusRequest {

    private ContractCategory category;
    private ContractStatus nextStatus;
}