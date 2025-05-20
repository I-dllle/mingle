package com.example.mingle.domain.chat.archive.entity;

import com.example.mingle.domain.chat.archive.entity.ArchiveTag;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ArchiveItem extends BaseEntity {

    // 어떤 자료방에 속해 있는지
    @Column(nullable = false)
    private Long chatRoomId;

    // 업로더 유저 연관관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    // 실제 파일 URL (S3 링크 등)
    @Column(nullable = false)
    private String fileUrl;

    // fileName → originalFilename
    @Column(nullable = false)
    private String originalFilename;

    // 썸네일 (선택적 필드)
    private String thumbnailUrl;

    // @ElementCollection → 태그를 개별 엔티티 ArchiveTag로 분리
    // 이유: 태그 검색, 연동, 수정 등 확장성 고려
    @OneToMany(mappedBy = "archiveItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArchiveTag> tags = new ArrayList<>();


    // 추후: 파일 타입, 사이즈, 다운로드 횟수 등도 확장 가능
}

