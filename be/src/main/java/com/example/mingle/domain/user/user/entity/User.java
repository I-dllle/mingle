package com.example.mingle.domain.user.user.entity;

import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.global.jpa.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString(exclude = "password")
@Table(name = "user")
public class User extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "email", length = 50)
    private String name;

    @Column(name = "name")
    private String nickname;

    @Column
    private String loginId;

    @JsonIgnore
    @Column
    private String password;

    @Column
    private String email;

    @Column
    private String phoneNum;

    @Column
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column
    @Builder.Default
    private UserStatus status = UserStatus.OFFLINE;

}
