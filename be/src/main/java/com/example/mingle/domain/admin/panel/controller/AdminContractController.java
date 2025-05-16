package com.example.mingle.domain.admin.contract;

import com.example.mingle.domain.post.legalpost.dto.contract.ContractSimpleDto;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/contracts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminContractController {
    private final ContractService contractService;

    @GetMapping
    public ResponseEntity<List<ContractSimpleDto>> getAll() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    @GetMapping("/{id}/conditions")
    public ResponseEntity<ContractConditionResponse> getConditions(@PathVariable Long id) {
        return ResponseEntity.ok(contractService.getContractConditions(id));
    }
}