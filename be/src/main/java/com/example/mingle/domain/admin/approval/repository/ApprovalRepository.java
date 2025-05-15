package com.example.mingle.domain.admin.approval.repository;

import com.example.mingle.domain.admin.approval.entity.Approval;
import com.example.mingle.domain.admin.approval.entity.ApprovalStatus;
import com.example.mingle.domain.admin.approval.entity.ApprovalType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {

    /**
     * 현재 승인 대기 상태(PENDING)인 요청 목록 조회
     */
    List<Approval> findByStatus(ApprovalStatus status);

    /**
     * 특정 타입(예: CONTRACT) + 특정 상태(PENDING) 필터로 조회
     * → ex) 계약 승인만 보고 싶을 때
     */
    List<Approval> findByTypeAndStatus(ApprovalType type, ApprovalStatus status);
}