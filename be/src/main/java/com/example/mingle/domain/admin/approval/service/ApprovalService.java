package com.example.mingle.domain.admin.approval.service;

import com.example.mingle.domain.admin.approval.dto.ApprovalListDto;
import com.example.mingle.domain.admin.approval.dto.ApprovalRequestDto;
import com.example.mingle.domain.admin.approval.entity.Approval;
import com.example.mingle.domain.admin.approval.entity.ApprovalStatus;
import com.example.mingle.domain.admin.approval.entity.ApprovalType;
import com.example.mingle.domain.admin.approval.repository.ApprovalRepository;
import com.example.mingle.domain.post.legalpost.enums.ContractStatus;
import com.example.mingle.domain.post.legalpost.service.ContractService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final ContractService contractService; // 예: 계약 승인 시 실제 계약 상태 변경용


//  현재 승인 대기 상태(PENDING)인 모든 승인 요청 목록을 반환
    public List<ApprovalListDto> getPendingApprovals() {
        return approvalRepository.findByStatus(ApprovalStatus.PENDING)
                .stream()
                .map(ApprovalListDto::from)
                .toList();
    }



//     1. 승인 요청 상태를 APPROVED로 변경
//     2. 승인 시간, 코멘트 등 기록
//     3. 대상 타입이 CONTRACT일 경우, 실제 계약도 CONFIRMED 상태로 변경

    public void approve(Long approvalId, ApprovalRequestDto dto) {
        Approval approval = approvalRepository.findById(approvalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "승인 요청이 존재하지 않습니다"));

        approval.setStatus(ApprovalStatus.APPROVED);
        approval.setApprovedAt(LocalDateTime.now());
        approval.setComment(dto.getComment());

        // 승인 대상 처리 (예: 계약 상태 변경)
        switch (approval.getType()) {
            case CONTRACT -> contractService.changeStatus(approval.getTargetId(), ContractStatus.CONFIRMED);
//            case LEAVE -> leaveRequestService.changeStatus(approval.getTargetId(), LeaveStatus.APPROVED);
//            case SETTLEMENT -> settlementService.approve(approval.getTargetId()); // 정산 승인 처리
//            case POST -> postService.publish(approval.getTargetId()); // 게시물 게시 처리
            default -> throw new IllegalArgumentException("지원하지 않는 승인 타입입니다.");
        }
    }



//     1. 승인 요청 상태를 REJECTED로 변경
//     2. 반려 사유(comment) 저장

    public void reject(Long approvalId, ApprovalRequestDto dto) {
        Approval approval = approvalRepository.findById(approvalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "승인 요청이 존재하지 않습니다"));

        approval.setStatus(ApprovalStatus.REJECTED);
        approval.setComment(dto.getComment());
    }
}