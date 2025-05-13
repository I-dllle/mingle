package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByUserId(Long userId);

    Optional<Contract> findByModusignDocumentId(String documentId);

    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status <> 'CONFIRMED' AND c.endDate BETWEEN CURRENT_DATE AND CURRENT_DATE + 7")
    long countExpiringContracts();

    long countByStatus(ContractStatus status);

    @Query("SELECT c.contractType, COUNT(c) FROM Contract c GROUP BY c.contractType")
    Map<String, Long> countByContractType();

    @Query("SELECT c.status, COUNT(c) FROM Contract c GROUP BY c.status")
    Map<String, Long> countByStatus();
}