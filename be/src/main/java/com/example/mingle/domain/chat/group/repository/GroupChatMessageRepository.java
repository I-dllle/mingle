package com.example.mingle.domain.chat.group.repository;

import com.example.mingle.domain.chat.group.entity.GroupChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupChatMessageRepository extends JpaRepository<GroupChatMessage, Long> {

    // 특정 채팅방에 속한 메시지들 조회
    List<GroupChatMessage> findAllByChatRoomId(Long chatRoomId);
}
