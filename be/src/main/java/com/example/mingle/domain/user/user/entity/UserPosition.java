package com.example.mingle.domain.user.user.entity;

import jakarta.persistence.*;

import com.example.mingle.domain.user.team.entity.Department;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPosition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PositionCode code;

    private String name;

    /**
     * 사용자의 조직 소속 - 부서 기준
     * 프로젝트 소속은 User 엔티티에서 별도 관리
     */
    @ManyToOne(fetch = FetchType.LAZY)
    private Department department;

    /**
     * 프로젝트 리더 여부: 특정 artistTeam의 책임자인지 여부
     * 현재는 부서(teamId)와의 비교만 가능하므로 scope가 PROJECT일 경우엔 User 엔티티 등에서 처리
     */
    @Column(nullable = false)
    private boolean isProjectLeader; // 해당 유저가 프로젝트 책임자인지 여부

    /**
     * 부서 ID 반환 (scope가 DEPARTMENT일 때 teamId로 사용됨)
     */
    public Long getTeamId() {
        return department != null ? department.getId() : null;
    }
}
