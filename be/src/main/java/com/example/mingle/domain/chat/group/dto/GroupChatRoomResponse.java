package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;

public record GroupChatRoomResponse(
        Long id,
        String name,
        RoomType roomType,
        ChatScope scope
) {}
