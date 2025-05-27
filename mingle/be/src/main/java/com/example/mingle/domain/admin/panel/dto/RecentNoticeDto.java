package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.post.post.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RecentNoticeDto {
    private Long id;
    private String title;
    private String authorName;
    private LocalDateTime createdAt;

    public static RecentNoticeDto fromEntity(Post post) {
        return RecentNoticeDto.builder()
                .id(post.getId())
                .title(post.getTitle())
                .authorName(post.getUser().getName())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
