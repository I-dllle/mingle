package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "settlement_ratio")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class SettlementRatio extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatioType ratioType; // AGENCY, ARTIST, PRODUCER 등

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // 회사 몫일 경우 null
    private User user;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal percentage; // 예: 30.00
}
