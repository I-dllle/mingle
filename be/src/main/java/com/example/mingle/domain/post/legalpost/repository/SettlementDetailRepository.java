package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.entity.SettlementDetail;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SettlementDetailRepository extends JpaRepository<SettlementDetail, Long> {
    void deleteBySettlement(Settlement settlement);

    @Query("SELECT COALESCE(SUM(sd.amount), 0) FROM SettlementDetail sd WHERE sd.user.id = :userId")
    BigDecimal getTotalRevenueByUser(@Param("userId") Long userId); // 유저별 수익

    @Query("""
    SELECT SUM(sd.amount)
    FROM SettlementDetail sd
    WHERE sd.ratioType = :ratioType
""")
    BigDecimal calculateTotalByRatioType(@Param("ratioType") RatioType ratioType);

    @Query("""
    SELECT 
        FUNCTION('DATE_FORMAT', sd.createdAt, '%Y-%m') AS month,
        SUM(sd.amount)
    FROM SettlementDetail sd
    GROUP BY FUNCTION('DATE_FORMAT', sd.createdAt, '%Y-%m')
    ORDER BY month ASC
""")
    List<Object[]> findMonthlyRevenueSummary();

    @Query("""
    SELECT sd.user.id, sd.user.nickname, SUM(sd.amount)
    FROM SettlementDetail sd
    WHERE sd.ratioType = 'ARTIST'
    GROUP BY sd.user.id, sd.user.nickname
    ORDER BY SUM(sd.amount) DESC
""")
    List<Object[]> findTopArtistRevenue();

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
""")
    BigDecimal getTotalRevenueByContract(@Param("contractId") Long contractId);

    @Query("""
    SELECT sd
    FROM SettlementDetail sd
    WHERE sd.settlement.contract.id = :contractId
""")
    List<SettlementDetail> findAllByContractId(@Param("contractId") Long contractId);

}