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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Project project;

    // 이 프로젝트의 리더로 지정된 유저
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;


    private LocalDateTime grantedAt;
}
