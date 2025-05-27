package com.example.mingle.domain.post.legalpost.repository;


import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.entity.SettlementDetail;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.post.legalpost.enums.SettlementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SettlementDetailRepository extends JpaRepository<SettlementDetail, Long> {
    void deleteBySettlement(Settlement settlement);

    @Query("""
    SELECT COALESCE(SUM(sd.amount), 0)
    FROM SettlementDetail sd
    WHERE sd.user.id = :userId
      AND sd.status != :excludedStatus
""")
    BigDecimal getTotalRevenueByUser(
            @Param("userId") Long userId,
            @Param("excludedStatus") SettlementStatus excludedStatus
    );


    @Query("""
    SELECT SUM(sd.amount)
    FROM SettlementDetail sd
    WHERE sd.ratioType = :ratioType
      AND sd.status != :excludedStatus
""")
    Optional<BigDecimal> calculateTotalByRatioType(
            @Param("ratioType") RatioType ratioType,
            @Param("excludedStatus") SettlementStatus excludedStatus
    );
    @Query("""
    SELECT 
        FUNCTION('DATE_FORMAT', sd.createdAt, '%Y-%m') AS month,
        SUM(sd.amount)
    FROM SettlementDetail sd
    WHERE sd.status != :deletedStatus
    GROUP BY FUNCTION('DATE_FORMAT', sd.createdAt, '%Y-%m')
    ORDER BY month ASC
""")
    List<Object[]> findMonthlyRevenueSummary(@Param("deletedStatus") SettlementStatus deletedStatus);


    @Query("""
    SELECT sd.user.id, sd.user.nickname, SUM(sd.amount)
    FROM SettlementDetail sd
    WHERE sd.ratioType = 'ARTIST'
      AND sd.status != :excludedStatus
    GROUP BY sd.user.id, sd.user.nickname
    ORDER BY SUM(sd.amount) DESC
""")
    List<Object[]> findTopArtistRevenue(@Param("excludedStatus") SettlementStatus excludedStatus);


    @Query("""
    SELECT sd.ratioType, SUM(sd.amount)
    FROM SettlementDetail sd
    GROUP BY sd.ratioType
""")
    List<Object[]> getRevenueGroupedByRatioType();

    @Query("""
    SELECT SUM(sd.amount)
    FROM SettlementDetail sd
    WHERE sd.settlement.contract.id = :contractId
      AND sd.status != :excludedStatus
""")
    BigDecimal getTotalRevenueByContract(
            @Param("contractId") Long contractId,
            @Param("excludedStatus") SettlementStatus excludedStatus
    );

    @Query("""
    SELECT sd
    FROM SettlementDetail sd
    WHERE sd.settlement.contract.id = :contractId
""")
    List<SettlementDetail> findAllByContractId(@Param("contractId") Long contractId);

    @Transactional
    @Modifying
    @Query("DELETE FROM SettlementDetail d WHERE d.settlement.id = :settlementId")
    void deleteBySettlementId(@Param("settlementId") Long settlementId);

    List<SettlementDetail> findAllBySettlement(Settlement settlement);


    @Query("""
    SELECT SUM(sd.amount)
    FROM SettlementDetail sd
    WHERE sd.ratioType = :ratioType
      AND sd.status != :excludedStatus
      AND sd.createdAt BETWEEN :startDate AND :endDate
""")
    Optional<BigDecimal> calculateTotalByRatioTypeAndDateRange(
            @Param("ratioType") RatioType ratioType,
            @Param("excludedStatus") SettlementStatus excludedStatus,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}