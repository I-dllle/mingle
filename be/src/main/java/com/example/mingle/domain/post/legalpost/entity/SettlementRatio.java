package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.RatioType;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "settlement_ratio")
public class SettlementRatio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratioId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatioType ratioType; // Artist, Agency, Producer 등

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

}
