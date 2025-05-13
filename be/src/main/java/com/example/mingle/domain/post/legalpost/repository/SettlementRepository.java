package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    List<Settlement> findByUserId(Long userId);

    List<Settlement> findByIsSettledFalse();

    @Query("SELECT s FROM Settlement s WHERE s.contract.contractId = :contractId")
    List<Settlement> findByContractId(@Param("contractId") Long contractId);
}