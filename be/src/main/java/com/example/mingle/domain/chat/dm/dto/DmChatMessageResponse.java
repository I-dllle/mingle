package com.example.mingle.domain.chat.dm.dto;

import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import com.example.mingle.domain.chat.common.enums.MessageFormat;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * DM 채팅 메시지를 응답할 때 사용하는 DTO
 */
@Builder
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
        return DmChatMessageResponse.builder()
                .messageId(m.getId())
                .senderId(m.getSenderId())
                .receiverId(m.getReceiverId())
                .content(m.getContent())
                .format(m.getFormat())
                .sentAt(m.getCreatedAt())
                .build();
    }
}
