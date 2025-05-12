package com.example.mingle.domain.post.post.entity;

import com.example.mingle.domain.post.post.enums.MenuType;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class PostType {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MenuType type; // 업무, 자료 등

    // 게시판 생성자
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User creator;

    // 소속 팀
    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(nullable = false, length = 100)
    private String posttypeName;

    @OneToMany(mappedBy = "postType")
    private List<Post> posts;

}
