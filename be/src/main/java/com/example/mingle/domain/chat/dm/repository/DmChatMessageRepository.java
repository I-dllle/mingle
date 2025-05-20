package com.example.mingle.domain.chat.dm.repository;

import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DmChatMessageRepository extends JpaRepository<DmChatMessage, Long> {

    // 특정 DM 채팅방의 메시지 목록을 생성일 오름차순으로 조회 (채팅방 입장 시 초기 로딩용)
    List<DmChatMessage> findByDmRoomIdOrderByCreatedAtAsc(Long dmRoomId);

    // 추후 구현: 마지막 메시지 조회용
    Optional<DmChatMessage> findTopByDmRoomIdOrderByCreatedAtDesc(Long roomId); // TODO

    // 추후 구현: 읽지 않은 메시지 수
    int countByDmRoomIdAndReceiverIdAndIsReadFalse(Long roomId, Long userId); // TODO
}
