package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.SettlementCategory;
import com.example.mingle.domain.post.legalpost.enums.SettlementStatus;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "settlement")
@Getter@Setter
@SuperBuilder
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Settlement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @Column(nullable = false)
    private LocalDate incomeDate; // 수익 입금일


    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount; // 입금된 총 수익
    private String source; // 입금 출처

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String memo;

    @Column(nullable = false)
    private Boolean isSettled;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SettlementStatus status;
}
