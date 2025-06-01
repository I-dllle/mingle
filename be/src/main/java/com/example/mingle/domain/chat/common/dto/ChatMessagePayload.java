package com.example.mingle.domain.chat.common.dto;

import com.example.mingle.domain.chat.common.enums.ChatRoomType;
import com.example.mingle.domain.chat.common.enums.MessageFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * WebSocket으로 주고받는 채팅 메시지의 구조를 정의한 DTO
 * - 그룹/DM 공용
 * - 저장 및 전송 시 사용
 */
@Builder
@Getter
@NoArgsConstructor
public class ChatMessagePayload {

    @NotNull(message = "roomId는 필수입니다.")
    private Long roomId;       // 메시지를 보낼 채팅방 ID

    @NotNull(message = "senderId는 필수입니다.")
    private Long senderId;      // 메시지를 보낸 유저 ID

    /**
     * DM 채팅 시, 수신자 ID (그룹 채팅 시 null)
     */
    private Long receiverId;

    @NotBlank(message = "메시지 내용은 비어 있을 수 없습니다.")
    private String content;    // 전송할 메시지 본문

    @NotNull(message = "메시지 형식(format)은 필수입니다.")
    private MessageFormat format;       // TEXT, IMAGE

    @NotNull(message = "채팅방 타입(chatType)은 필수입니다.")
    private ChatRoomType roomType;      // GROUP, DIRECT

    @NotNull(message = "메시지 생성 시각은 필수입니다.")
    private LocalDateTime createdAt; // 메시지 생성 시각 (프론트 or 서버 기준)

    public ChatMessagePayload(Long roomId, Long senderId, Long receiverId, String content, MessageFormat format, ChatRoomType roomType, LocalDateTime createdAt) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.format = format;
        this.roomType = roomType;
        this.createdAt = createdAt;
    }
}
