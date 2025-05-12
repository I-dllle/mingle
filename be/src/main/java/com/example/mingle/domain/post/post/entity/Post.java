package com.example.mingle.domain.post.post.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Post {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 소속 팀
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

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
    private String content;

    private String imageUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private boolean isDeleted;

    public enum Category {
        공지, 회의록, 자료, 일반, 기타
    }
}
