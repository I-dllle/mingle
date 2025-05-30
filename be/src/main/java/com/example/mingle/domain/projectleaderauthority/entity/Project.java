package com.example.mingle.domain.projectleaderauthority.entity;

import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class Project extends BaseEntity {

    // 프로젝트 고유 이름 : 사용자용 출력값
    // 회사 내부 규칙에 따라 중복 허용 가능
    @Column(nullable = false)
    private String name; // 프로젝트 이름

    private LocalDate endDate; // 프로젝트 종료일

    // 이 프로젝트의 리더 권한 목록
    @OneToMany(mappedBy = "project")
    private List<ProjectLeaderAuth> leaders;
}
