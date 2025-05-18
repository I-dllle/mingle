package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contract_external")
@Getter
@Setter
public class ContractExternal extends BaseEntity {

    @Column(length = 200)
    private String title; // 계약 제목

    @Column(length = 100)
    private String advertiserName; // 광고사 또는 방송사 명

    @Column(length = 500)
    private String fileUrl; // 계약서 스캔본 또는 업로드된 파일

    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private LocalDate contractDate;

    @Column(nullable = false)
    private BigDecimal revenueAmount; // 실제 수익금

    @Column(nullable = false)
    private LocalDate incomeDate; // 수익 입금일

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractType contractType; // PAPER

    @Column(length = 100)
    private String companyName; // 계약 주체 회사명

    @OneToMany(mappedBy = "contractExternal")
    private List<Settlement> settlements = new ArrayList<>();
}
