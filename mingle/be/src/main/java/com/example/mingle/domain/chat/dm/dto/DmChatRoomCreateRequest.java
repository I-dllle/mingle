package com.example.mingle.domain.chat.dm.dto;

import jakarta.validation.constraints.NotNull;

public record DmChatRoomCreateRequest(
        @NotNull(message = "수신자 ID(receiverId)는 필수입니다.")
        Long receiverId
) {}
