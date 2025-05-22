package com.example.mingle.domain.chat.dm.dto;

import com.example.mingle.domain.chat.common.enums.MessageFormat;

public record DmChatMessageRequest(
        Long receiverId,       // 수신자 ID
        String content,        // 메시지 내용
        MessageFormat format   // TEXT / IMAGE / 등
) {
}
