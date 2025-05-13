package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;
import com.example.mingle.domain.user.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "settlement")
@Getter@Setter
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long settlementId;

    // 정산 대상 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SettlementCategory category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String memo;

    @Column(nullable = false)
    private Boolean isSettled;

}
