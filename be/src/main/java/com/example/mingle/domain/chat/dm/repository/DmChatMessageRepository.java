package com.example.mingle.domain.chat.dm.repository;

import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DmChatMessageRepository extends JpaRepository<DmChatMessage, Long> {

    // 기본 조회: 생성일 오름차순 (가장 오래된 메시지부터) → 초기 전체 로딩용
    List<DmChatMessage> findByDmRoomIdOrderByCreatedAtAsc(Long dmRoomId);

    // 최근 1개 조회 (DM 목록 미리보기용)
    Optional<DmChatMessage> findTopByDmRoomIdOrderByCreatedAtDesc(Long roomId); // TODO

    // 읽지 않은 메시지 수 조회 (수신자 기준 미확인 메시지)
    int countByDmRoomIdAndReceiverIdAndIsReadFalse(Long roomId, Long userId); // TODO

    // 페이징 조회: 특정 시각 이전 메시지를 최신순으로 20개 조회
    List<DmChatMessage> findTop20ByDmRoomIdAndCreatedAtBeforeOrderByCreatedAtDesc(
            Long dmRoomId,
            LocalDateTime cursor
    );
}
