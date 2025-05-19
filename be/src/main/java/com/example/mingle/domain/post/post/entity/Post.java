package com.example.mingle.domain.post.post.entity;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Where;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Where(clause = "is_deleted = false")
public class Post extends BaseEntity{
    // 소속 부서
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    // 게시판
    @ManyToOne
    @JoinColumn(name = "post_menu_id")
    private PostMenu menu;

    @ManyToOne
    @JoinColumn(name = "post_type_id")
    private PostType postType;

    // 게시글 분류 (공지, 회의록 등)
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private BusinessDocumentCategory category;

    // 작성자
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "title", length = 50, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "image_url")
    private String[] imageUrl;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    private NoticeType noticeType;

    //게시글 수정 메소드
    public void update(String title, String content, BusinessDocumentCategory category, String[] imageUrl) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.imageUrl = imageUrl;
    }
}
