package com.example.mingle.domain.admin.approval.entity;

import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "approval")
public class Approval extends BaseEntity {

    // 어떤 항목의 승인인지
    @Enumerated(EnumType.STRING)
    private ApprovalType type;

    // 실제 승인 대상 ID (ex: Contract, Settlement 등)
    private Long targetId;

    // 승인 상태
    @Enumerated(EnumType.STRING)
    private ApprovalStatus status;

    // 승인 요청한 관리자 ID
    private Long adminId;

    private String comment;

    private LocalDateTime approvedAt;

    // 생성일, 수정일 등 BaseEntity 상속 추천
}
