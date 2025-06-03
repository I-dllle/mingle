package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;
import com.example.mingle.domain.chat.dm.dto.DmChatMessageResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface DmChatMessageService {
    /**
     * DM 메시지 저장 및 송신
     * - 유효성 검증 → DB 저장 → 양쪽 유저에게 WebSocket 전송까지 한 번에 처리
     * - ChatMessagePayload에는 senderId, receiverId, content, format 등 포함됨
     */
    void saveAndSend(ChatMessagePayload payload);

    // 추후 구현: 메시지 삭제
    void deleteMessage(Long messageId); // TODO: 구현 예정

    // 추후 구현: 메시지 수정
    void editMessage(Long messageId, String newContent); // TODO: 구현 예정

    // 추후 구현: 채팅방별 최근 메시지 반환 (DM 목록 뷰 용)
    String getLatestMessageInRoom(Long dmRoomId); // TODO: 구현 예정

    // 추후 구현: 읽지 않은 메시지 개수 조회
    int countUnreadMessages(Long dmRoomId, Long userId); // TODO: 구현 예정

    // 페이징 메시지 조회
    // - cursor 기준으로 이전 메시지를 size=20개까지 조회
    // - 최초 요청 시 cursor가 null이면 현재 시각 기준으로 조회됨
    List<DmChatMessageResponse> getMessagesByRoomIdBefore(Long roomId, LocalDateTime cursor, Long loginUserId);
}
