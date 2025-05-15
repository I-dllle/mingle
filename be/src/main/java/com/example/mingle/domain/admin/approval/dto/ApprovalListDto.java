package com.example.mingle.domain.admin.approval.dto;

import com.example.mingle.domain.admin.approval.entity.Approval;
import com.example.mingle.domain.admin.approval.entity.ApprovalStatus;
import com.example.mingle.domain.admin.approval.entity.ApprovalType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApprovalListDto {

    private Long id;                  // approval PK
    private ApprovalType type;       // 계약, 정산, 휴가 등
    private Long targetId;           // 실제 대상의 ID (예: Contract ID)
    private ApprovalStatus status;   // PENDING, APPROVED, REJECTED
    private String comment;          // 코멘트 (있다면)
    private LocalDateTime requestedAt; // 승인 요청 시간
    private LocalDateTime approvedAt;  // 승인 완료 시간 (null일 수 있음)

    public static ApprovalListDto from(Approval approval) {
        return ApprovalListDto.builder()
                .id(approval.getId())
                .type(approval.getType())
                .targetId(approval.getTargetId())
                .status(approval.getStatus())
                .comment(approval.getComment())
                .requestedAt(approval.getCreatedAt()) // BaseEntity 상속 시
                .approvedAt(approval.getApprovedAt())
                .build();
    }
}
