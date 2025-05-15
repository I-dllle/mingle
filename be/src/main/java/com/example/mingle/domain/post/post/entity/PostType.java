package com.example.mingle.domain.post.post.entity;

import com.example.mingle.domain.post.post.enums.MenuType;
import com.example.mingle.domain.user.team.entity.ArtistTeam;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
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

    // 소속 부서
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false, length = 100)
    private String posttypeName;

    @OneToMany(mappedBy = "postType")
    private List<Post> posts;

}
