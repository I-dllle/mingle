package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.MessageFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GroupChatMessageRequest (
    @NotNull(message = "roomId는 필수입니다.")
    Long roomId,

    @NotNull(message = "senderId는 필수입니다.")
    Long senderId,

    @NotBlank(message = "메시지 본문은 필수입니다.")
    String content,

    @NotNull(message = "메시지 타입은 필수입니다.")
    MessageFormat format

) {}
