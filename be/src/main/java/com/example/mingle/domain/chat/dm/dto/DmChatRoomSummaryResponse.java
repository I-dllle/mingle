package com.example.mingle.domain.chat.dm.dto;

import com.example.mingle.domain.chat.common.enums.MessageFormat;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * DM 채팅방 요약 정보 DTO
 * - 채팅방 목록에 표시될 정보 (최근 메시지, 미확인 수 등)
 */
@Builder
public record DmChatRoomSummaryResponse(
        Long roomId,               // 채팅방 ID
        String opponentNickname,   // 상대방 닉네임
        String previewMessage,     // 가장 최근 메시지 본문
        MessageFormat format,      // 메시지 포맷 (TEXT, IMAGE 등)
        int unreadCount,           // 읽지 않은 메시지 수
        LocalDateTime sentAt       // 가장 최근 메시지 시간
) {}
