package com.example.mingle.domain.projectleaderauthority.entity;

import com.example.mingle.global.jpa.BaseEntity;
import com.example.mingle.domain.user.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
public class ProjectLeaderAuth extends BaseEntity {

    // 내부 식별용 (teamId)
    @Column(nullable = false)
    private Long projectId;


    // 프로젝트 고유 이름 : 사용자용 출력값
    // 회사 내부 규칙에 따라 중복 허용 가능
    @Column(nullable = false)
    private String projectName;


    // 이 프로젝트의 리더로 지정된 유저
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;


    private LocalDateTime grantedAt;
}
