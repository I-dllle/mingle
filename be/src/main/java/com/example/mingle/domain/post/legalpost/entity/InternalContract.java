package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.ContractCategory;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter@Setter
@Entity
public class InternalContract extends BaseEntity {
    // 계약 당사자: 아티스트 또는 일반 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal defaultRatio;
    private String companyName;

    @Column(length = 200)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractCategory contractCategory;

    private Long writerId;

    @Column(length = 100)
    private String signerName;

    @Column(columnDefinition = "TEXT")
    private String signerMemo;

    // 계약서 파일 (업로드 경로 등)
    @Column(length = 500, nullable = false)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatioType ratioType;

    private String docusignEnvelopeId;

    @Column(name = "docusign_url", columnDefinition = "TEXT")
    private String docusignUrl;
}
