package com.example.mingle.domain.admin.panel.service;


import com.example.mingle.domain.admin.panel.dto.ContractConditionResponse;
import com.example.mingle.domain.admin.panel.dto.ContractResponse;
import com.example.mingle.domain.admin.panel.dto.ContractSearchCondition;
import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminContractService {

    private final ContractRepository contractRepository;

    public Page<ContractResponse> getContractsByFilter(ContractSearchCondition condition, Pageable pageable) {
        return contractRepository.findAll(
                ContractSpecification.build(condition), pageable
        ).map(ContractResponse::from);
    }

    public ContractConditionResponse getContractConditions(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.CONTRACT_NOT_FOUND));
        return ContractConditionResponse.from(contract);
    }
}
