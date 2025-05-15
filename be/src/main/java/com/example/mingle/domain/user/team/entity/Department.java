package com.example.mingle.domain.user.team.entity;

import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
@ToString
@Table(name = "department")
public class Department extends BaseEntity {
    @Builder.Default
    @OneToMany(mappedBy = "department")
    private List<User> users = new ArrayList<>();

    @Column(name = "department_name", length=50)
    private String departmentName;
}
