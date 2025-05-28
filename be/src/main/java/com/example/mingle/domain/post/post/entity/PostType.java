package com.example.mingle.domain.post.post.entity;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
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
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"department_id", "menu_id"})
)
public class PostType extends BaseEntity {
    @ManyToOne(cascade = CascadeType.PERSIST) 
    @JoinColumn(name = "menu_id", nullable = false)
    private PostMenu menu;

    // 게시판 생성자
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User creator;

    // 소속 부서
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "postType")
    private List<Post> posts;

}
