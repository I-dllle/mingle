package com.example.mingle.domain.post.legalpost.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "settlement")
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long settlementId;

    // 정산 대상 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SettlementCategory category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Lob
    private String memo;

    @Column(nullable = false)
    private Boolean isSettled;

    public enum SettlementCategory {
        광고수익, 음원수익, 출연료정산, 용역료정산, 행사정산
    }
}
