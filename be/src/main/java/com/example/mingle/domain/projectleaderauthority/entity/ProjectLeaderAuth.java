package com.example.mingle.domain.projectleaderauthority.entity;

import com.example.mingle.global.jpa.BaseEntity;
import com.example.mingle.domain.user.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProjectLeaderAuth extends BaseEntity {

    /**
     * 프로젝트의 고유 이름 또는 식별자
     * - 회사 내부 규칙에 따라 중복 허용 가능
     */
    private String projectName;



    /**
     * 이 프로젝트의 리더로 지정된 유저
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;



    private LocalDateTime grantedAt;
}
