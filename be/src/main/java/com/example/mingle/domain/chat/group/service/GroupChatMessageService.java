package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;

public interface GroupChatMessageService {
    void saveAndBroadcast(ChatMessagePayload payload);
}
