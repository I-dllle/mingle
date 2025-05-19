package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface ContractRepository extends JpaRepository<Contract, Long>, JpaSpecificationExecutor<Contract> {


    @Query("""
    SELECT COUNT(c)
    FROM Contract c
    WHERE c.status <> 'CONFIRMED'
    AND c.endDate BETWEEN :startDate AND :endDate
""")
    long countExpiringContracts(@Param("startDate") LocalDate start, @Param("endDate") LocalDate end);


    long countByStatus(ContractStatus status);

    @Query("""
    SELECT c FROM Contract c
    WHERE c.endDate BETWEEN CURRENT_DATE AND :deadline
      AND c.status != :terminated
""")
    List<Contract> findExpiringContracts(@Param("deadline") LocalDate deadline,
                                         @Param("terminated") ContractStatus terminated);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT c.status, COUNT(c) " +
            "FROM Contract c " +
            "GROUP BY c.status")
    List<Object[]> countContractsByStatus();

    List<Contract> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime time);

    List<Contract> findByParticipants_IdAndContractCategory(Long userId, ContractCategory category);

}