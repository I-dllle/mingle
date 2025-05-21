package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;

public interface GroupChatMessageService {
    void saveAndBroadcast(ChatMessagePayload payload);

    // 시스템 메시지 전송용 메서드
    // - format = SYSTEM, senderId는 null 또는 0L로 설정
    // - 예: "[OOO]님이 입장했습니다"
    void sendSystemMessage(String content, Long roomId);
}
