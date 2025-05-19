package com.example.mingle.domain.post.post.entity;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PostMenu extends BaseEntity {
    @Column(name = "code", unique = true, nullable = false)
    private String code;        // ex : BUSINESS_DOCUMENTS
    @Column(name = "name", nullable = false)
    private String name;        // ex : 업무자료
    @Column(name = "description")
    private String description; // 설명 필요 시

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id") //어떤 부서에 소속된 메뉴인지
    private Department department;
}