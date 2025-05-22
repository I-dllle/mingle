package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.domain.chat.group.entity.GroupChatMessage;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * 채팅방에서 조회된 메시지를 반환하기 위한 DTO
 */
@Builder
public record GroupChatMessageResponse(
        Long messageId,  // 메시지 고유 ID
        Long senderId,  // 보낸 사람의 사용자 ID
        String content,  // 메시지 본문
        MessageFormat format,  // 메시지 타입 (TEXT, IMAGE, FILE, SYSTEM, ARCHIVE 등)
        LocalDateTime createdAt   // 메시지 생성 시각
) {
    /**
     * Entity → DTO 변환용 정적 메서드
     */
    public static GroupChatMessageResponse from(GroupChatMessage message) {
        return GroupChatMessageResponse.builder()
                .messageId(message.getId())
                .senderId(message.getSenderId())
                .content(message.getContent())
                .format(message.getFormat())
                .createdAt(message.getCreatedAt())
                .build();
    }
}