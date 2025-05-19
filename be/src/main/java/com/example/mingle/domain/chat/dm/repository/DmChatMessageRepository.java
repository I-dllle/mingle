package com.example.mingle.domain.chat.dm.repository;

import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DmChatMessageRepository extends JpaRepository<DmChatMessage, Long> {

    // 특정 DM 채팅방의 메시지 리스트 조회
    List<DmChatMessage> findByRoomIdOrderByCreatedAtAsc(Long roomId);
}
