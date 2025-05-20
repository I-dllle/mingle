package com.example.mingle.domain.chat.dm.dto;

import jakarta.validation.constraints.NotNull;

public record DmChatRoomCreateRequest(
        @NotNull(message = "상대방 userId는 필수입니다.")
        Long targetUserId
) {}
