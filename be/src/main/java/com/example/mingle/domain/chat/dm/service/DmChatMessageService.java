package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;

public interface DmChatMessageService {
    void saveAndSend(ChatMessagePayload payload);
}
