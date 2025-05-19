package com.example.mingle.domain.chat.common.dto;

import com.example.mingle.domain.chat.common.enums.MessageType;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessagePayload {

    private Long roomId;       // 메시지를 보낼 채팅방 ID
    private Long senderId;      // 메시지를 보낸 유저 ID
    private String content;    // 전송할 메시지 본문
    private MessageType type;       // 메시지 타입 (text, image 등)

    public ChatMessagePayload(Long roomId, Long senderId, String content, MessageType type) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.content = content;
        this.type = type;
    }
}
