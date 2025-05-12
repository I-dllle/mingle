package com.example.mingle.domain.post.post.entity;

import com.example.mingle.domain.post.post.enums.Category;
import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Post extends BaseEntity{
    // 소속 부서
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // 작성자
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 게시판
    @ManyToOne
    @JoinColumn(name = "post_type_id")
    private PostType postType;

    // 게시글 분류 (공지, 회의록 등)
    private Category category;

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String imageUrl;

    private boolean isDeleted;
}
