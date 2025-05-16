package com.example.mingle.domain.post.legalpost.repository;

import com.example.mingle.domain.post.legalpost.entity.Contract;
import com.example.mingle.domain.post.legalpost.entity.SettlementDetail;
import com.example.mingle.domain.post.legalpost.entity.SettlementRatio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementDetailRepository extends JpaRepository<SettlementDetail, Long> {

    List<SettlementRatio> findByContract(Contract contract);


}