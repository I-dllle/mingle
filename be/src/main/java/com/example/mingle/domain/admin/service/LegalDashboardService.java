//package com.example.mingle.domain.admin.service;
//
//import com.example.mingle.domain.admin.dto.ContractDto;
//import com.example.mingle.domain.post.legalpost.repository.ContractRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class LegalDashboardService {
//
//    private final ContractRepository contractRepository;
//
//    public Map<String, Long> getContractTypeStats() {
//        return contractRepository.countByContractType();
//    }
//
//    public Map<String, Long> getContractStatusStats() {
//        return contractRepository.countByStatus();
//    }
//
//    public Map<String, Long> getSignatureStatusStats() {
//        return contractRepository.countBySignatureStatus();
//    }
//
//    public List<ContractDto> getExpiringContracts() {
//        LocalDate today = LocalDate.now();
//        LocalDate deadline = today.plusDays(30);
//        return contractRepository.findExpiringContracts(today, deadline)
//                .stream()
//                .map(ContractDto::from)
//                .collect(Collectors.toList());
//    }
//}
