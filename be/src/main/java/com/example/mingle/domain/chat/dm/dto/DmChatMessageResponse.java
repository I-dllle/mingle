package com.example.mingle.domain.chat.dm.dto;

import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import com.example.mingle.domain.chat.common.enums.MessageFormat;

import java.time.LocalDateTime;

public record DmChatMessageResponse(
        Long messageId,         // 메시지 ID
        Long senderId,          // 발신자 ID
        Long receiverId,        // 수신자 ID
        String content,         // 메시지 내용
        MessageFormat format,   // TEXT / IMAGE
        LocalDateTime sentAt    // 보낸 시간
) {

    // Entity → DTO 변환 정적 메서드
    public static DmChatMessageResponse from(DmChatMessage m) {
        return new DmChatMessageResponse(
                m.getId(),
                m.getSenderId(),
                m.getReceiverId(),
                m.getContent(),
                m.getFormat(),
                m.getCreatedAt()
        );
    }
}
