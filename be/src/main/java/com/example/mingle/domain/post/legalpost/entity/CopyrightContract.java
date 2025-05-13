package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.enums.ContractType;
import com.example.mingle.domain.post.legalpost.enums.CopyrightType;
import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "copyright")
public class CopyrightContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long copyrightContractId;

    // 권리자 (작곡가, 작사가 등)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 소속 아티스트 또는 소속팀
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_team_id")
    private ArtistTeam team;

    // 저작물 제목 (예: 곡 제목)
    @Column(nullable = false, length = 200)
    private String contentTitle;

    // 계약서 제목
    private String title;

    // 회사 이름
    private String companyName;

    // 권리 유형 (작곡/작사/편곡/저작인접권 등)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CopyrightType copyrightType;

    // 계약 시작/종료일
    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    // 정산 비율
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal sharePercentage;

    // 계약서 파일
    @Column(nullable = false, length = 500)
    private String fileUrl;

    // 계약 설명
    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary;

    // 계약 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status; // 기존 enum 재사용 가능 (DRAFT, SIGNED 등)

    // 전자계약 여부
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractType contractType; // ELECTRONIC or PAPER

    // 서명자 정보 (옵션)
    @Column(length = 100)
    private String signerName;

    @Column(columnDefinition = "TEXT")
    private String signerMemo;
}
