package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter@Setter
@Entity
@Table(name = "settlement_ratio")
public class SettlementRatio extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "copyrightContract_id", nullable = false)
    private CopyrightContract copyrightContract;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatioType ratioType; // Artist, Agency, Producer 등

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

}
