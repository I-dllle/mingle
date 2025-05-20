package com.example.mingle.domain.chat.dm.dto;

public record DmChatRoomResponse(
        Long roomId,
        Long userA,
        Long userB
) {}
