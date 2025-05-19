package com.example.mingle.domain.chat.common.dto;

import com.example.mingle.domain.chat.common.enums.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessagePayload {

    @NotNull(message = "roomId는 필수입니다.")
    private Long roomId;       // 메시지를 보낼 채팅방 ID

    @NotNull(message = "senderId는 필수입니다.")
    private Long senderId;      // 메시지를 보낸 유저 ID

    @NotBlank(message = "메시지 내용은 비어 있을 수 없습니다.")
    private String content;    // 전송할 메시지 본문

    @NotNull(message = "메시지 타입은 필수입니다.")
    private MessageType type;       // 메시지 타입 (text, image 등)

    public ChatMessagePayload(Long roomId, Long senderId, String content, MessageType type) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.content = content;
        this.type = type;
    }
}
