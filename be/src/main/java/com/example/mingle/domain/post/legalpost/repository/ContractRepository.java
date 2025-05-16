package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface ContractRepository extends JpaRepository<Contract, Long>, JpaSpecificationExecutor<Contract> {

    List<Contract> findByUserId(Long userId);

    @Query("""
    SELECT COUNT(c)
    FROM Contract c
    WHERE c.status <> 'CONFIRMED'
    AND c.endDate BETWEEN :startDate AND :endDate
""")
    long countExpiringContracts(@Param("startDate") LocalDate start, @Param("endDate") LocalDate end);


    long countByStatus(ContractStatus status);

}