package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.MessageFormat;

public record GroupChatMessageResponse(
        Long messageId,
        Long senderId,
        String content,
        MessageFormat format
) {}