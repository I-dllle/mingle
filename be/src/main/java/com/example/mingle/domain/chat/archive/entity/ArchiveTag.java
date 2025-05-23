package com.example.mingle.domain.chat.archive.entity;

import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class ArchiveTag extends BaseEntity {
    // 태그명 (ex: #아이디어)
    @Column(nullable = false)
    private String name;

    // 어떤 자료에 붙은 태그인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "archive_item_id")
    private ArchiveItem archiveItem;

    // 정적 생성자 (ServiceImpl에서 사용)
    public static ArchiveTag of(String tag, ArchiveItem item) {
        return ArchiveTag.builder()
                .name(tag)
                .archiveItem(item)
                .build();
    }
}
