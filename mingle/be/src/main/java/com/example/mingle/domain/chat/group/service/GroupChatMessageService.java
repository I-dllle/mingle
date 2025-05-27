package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;
import com.example.mingle.domain.chat.group.dto.GroupChatMessageResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface GroupChatMessageService {

    // 기존 메시지 저장 및 전송
    void saveAndBroadcast(ChatMessagePayload payload);

    // 채팅방 메시지 페이징 조회
    List<GroupChatMessageResponse> getMessagesByRoomIdBefore(
            Long roomId,
            LocalDateTime cursor
    );

    // 시스템 메시지 전송용 메서드
    // - format = SYSTEM, senderId는 null 또는 0L로 설정
    // - 예: "[OOO]님이 입장했습니다"
    void sendSystemMessage(String content, Long roomId);
}
