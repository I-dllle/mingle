package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GroupChatRoomCreateRequest(

        @NotNull(message = "teamId는 필수입니다.")
        Long teamId,

        @NotNull(message = "roomType은 필수입니다.")
        RoomType roomType,

        @NotNull(message = "scope는 필수입니다.")
        ChatScope scope,

        @NotBlank(message = "채팅방 이름은 필수입니다.")
        String name

) {}
