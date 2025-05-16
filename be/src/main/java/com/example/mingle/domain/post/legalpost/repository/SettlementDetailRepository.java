package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.Settlement;
import com.example.mingle.domain.post.legalpost.entity.SettlementDetail;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
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

}