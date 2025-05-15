package com.example.mingle.domain.post.post.dto;

import com.example.mingle.domain.post.post.entity.BusinessDocumentCategory;
import com.example.mingle.domain.post.post.entity.NoticeType;
import com.example.mingle.domain.post.post.entity.Post;
import com.example.mingle.domain.post.post.entity.PostMenu;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponseDto {
    private Long postId;
    private Long deptId;
    private String departmentName;

    private BusinessDocumentCategory businessDocumentCategory;   // 업무자료면 값 있음, 아니면 null
    private NoticeType noticeType;

    private String postMenuName; // 게시판 이름
    private Long postMenuId;   // 게시판 MenuType
    private String postMenuCode;

    private Long userId;
    private String writerName;
    private String title;
    private String content;
    private String[] imageUrl;

    private boolean isDeleted;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponseDto fromEntity(Post post) {
        return PostResponseDto.builder()
                .postId(post.getId())
                .deptId(post.getDepartment().getId())
                .departmentName(post.getDepartment().getDepartmentName())
                .postMenuId(post.getMenu().getId())
                .postMenuCode(post.getMenu().getCode())
                .postMenuName(post.getMenu().getName())
                .businessDocumentCategory(post.getCategory())
                .userId(post.getUser().getId())
                .writerName(post.getUser().getName())
                .title(post.getTitle())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .isDeleted(post.isDeleted())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

}
