package com.example.mingle.domain.post.legalpost.dto;

import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import lombok.Getter;

@Getter
public class ChangeStatusRequest {
    private ContractStatus nextStatus;
}