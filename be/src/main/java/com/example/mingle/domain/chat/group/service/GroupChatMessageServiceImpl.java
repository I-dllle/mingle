package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;
import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.domain.chat.group.dto.GroupChatMessageResponse;
import com.example.mingle.domain.chat.group.entity.GroupChatMessage;
import com.example.mingle.domain.chat.group.repository.GroupChatMessageRepository;
import com.example.mingle.global.websocket.WebSocketSessionManager;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupChatMessageServiceImpl implements GroupChatMessageService {

    private final GroupChatMessageRepository groupChatMessageRepository;
    private final WebSocketSessionManager sessionManager;
    private final ObjectMapper objectMapper;


    @Override
    public void saveAndBroadcast(ChatMessagePayload payload) {
        // 1. DB 저장
        GroupChatMessage message = GroupChatMessage.builder()
                .chatRoomId(payload.getRoomId())
                .content(payload.getContent())
                .format(payload.getFormat())
                .senderId(payload.getSenderId())
                .createdAt(LocalDateTime.now())
                .build();
        groupChatMessageRepository.save(message);

        // 2. 동일 채팅방 사용자에게 메시지 전송
        for (WebSocketSession session : sessionManager.getAllUserSessions().values()) {
            try {
                // content만 보내는 대신 payload 전체를 JSON으로 변환
                String json = objectMapper.writeValueAsString(payload);
                session.sendMessage(new TextMessage(payload.getContent()));
            } catch (Exception e) {
                log.warn("메시지 전송 실패", e);
            }
        }
    }



    // 채팅방 메시지 페이징 조회
    @Override
    public List<GroupChatMessageResponse> getMessagesByRoomIdBefore(Long roomId, LocalDateTime cursor) {
        // cursor가 null이면 현재 시각을 기준으로 조회 (최초 로딩 시)
        if (cursor == null) {
            cursor = LocalDateTime.now();
        }

        // Repository에서 메시지 조회
        List<GroupChatMessage> messages = groupChatMessageRepository
                .findTop20ByChatRoomIdAndCreatedAtBeforeOrderByCreatedAtDesc(roomId, cursor);

        // DTO 변환 후 반환
        return messages.stream()
                .map(GroupChatMessageResponse::from)
                .toList();
    }



    // 시스템 메시지 전송 메서드
    @Override
    public void sendSystemMessage(String content, Long roomId) {
        ChatMessagePayload systemMessage = ChatMessagePayload.builder()
                .roomId(roomId)
                .senderId(null) // 시스템 메시지이므로 사용자 없음
                .format(MessageFormat.SYSTEM)
                .content(content)
                .build();

        // 재사용: 기존 저장 + 전송 메서드 활용
        saveAndBroadcast(systemMessage);
    }
}
