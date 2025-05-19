package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;
import com.example.mingle.domain.chat.common.socket.WebSocketSessionManager;
import com.example.mingle.domain.chat.group.entity.GroupChatMessage;
import com.example.mingle.domain.chat.group.repository.GroupChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupChatMessageServiceImpl implements GroupChatMessageService {

    private final GroupChatMessageRepository groupChatMessageRepository;
    private final WebSocketSessionManager sessionManager;

    @Override
    public void saveAndBroadcast(ChatMessagePayload payload) {
        // 1. DB 저장
        GroupChatMessage message = GroupChatMessage.builder()
                .chatRoomId(payload.getRoomId())
                .content(payload.getContent())
                .format(payload.getFormat())
                .senderId(payload.getSenderId())
                .build();
        groupChatMessageRepository.save(message);

        // 2. 동일 채팅방 사용자에게 메시지 전송
        for (WebSocketSession session : sessionManager.getAllUserSessions().values()) {
            try {
                session.sendMessage(new TextMessage(payload.getContent()));
            } catch (Exception e) {
                log.warn("메시지 전송 실패", e);
            }
        }
    }
}
