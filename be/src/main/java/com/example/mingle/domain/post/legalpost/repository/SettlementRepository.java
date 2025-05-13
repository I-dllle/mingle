package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    @Query("SELECT s FROM Settlement s WHERE s.contract.contractId = :contractId")
    List<Settlement> findByContractId(@Param("contractId") Long contractId);

    @Query("""
    SELECT 
        COUNT(s) * 1.0 / 
        (SELECT COUNT(s2) FROM Settlement s2 WHERE FUNCTION('MONTH', s2.createdAt) = FUNCTION('MONTH', CURRENT_DATE)) 
    FROM Settlement s
    WHERE s.isSettled = true 
      AND FUNCTION('MONTH', s.createdAt) = FUNCTION('MONTH', CURRENT_DATE)
""")
    Double calculateThisMonthCompletionRate();
}