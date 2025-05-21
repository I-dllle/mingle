package com.example.mingle.domain.chat.group.repository;

import com.example.mingle.domain.chat.group.entity.GroupChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface GroupChatMessageRepository extends JpaRepository<GroupChatMessage, Long> {

    // 특정 채팅방에 속한 모든 메시지 조회 (전체 조회)
    List<GroupChatMessage> findAllByChatRoomId(Long chatRoomId);

    // 페이징: 특정 채팅방에서 cursor 이전 메시지 20개 조회 (최신순)
    // → 무한 스크롤 구현 시 사용
    List<GroupChatMessage> findTop20ByChatRoomIdAndCreatedAtBeforeOrderByCreatedAtDesc(
            Long chatRoomId,
            LocalDateTime cursor
    );
}
