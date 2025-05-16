package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter@Setter
@Entity
@Table(name = "settlement_Detail")
@SuperBuilder

public class SettlementDetail extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "settlement_id", nullable = false)
    private Settlement settlement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatioType ratioType; // Artist, Agency, Producer 등

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

}
