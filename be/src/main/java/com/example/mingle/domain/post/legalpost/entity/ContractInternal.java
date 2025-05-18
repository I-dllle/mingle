package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contract_internal")
@Getter
@Setter
public class ContractInternal extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 아티스트 or 프로듀서

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private ArtistTeam team;

    @Column(length = 200)
    private String title; // 계약서 제목

    @Column(length = 500, nullable = false)
    private String fileUrl; // 전자서명 완료된 PDF 경로

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractCategory contractCategory;

    @Column(precision = 5, scale = 2, nullable = false)
    private BigDecimal defaultRatio; // 기본 정산 비율 (예: 70.00)

    @Column(length = 100)
    private String signerName;

    @Column(columnDefinition = "TEXT")
    private String signerMemo;

    @Column(length = 100)
    private String companyName;

    private String docusignEnvelopeId;

    @Column(name = "docusign_url", columnDefinition = "TEXT")
    private String docusignUrl;
}
