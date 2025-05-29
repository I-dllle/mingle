package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.domain.chat.group.entity.GroupChatRoom;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * Group 채팅방 요약 정보 DTO
 * - 채팅방 목록에 표시될 정보 (최근 메시지, 미확인 수 등)
 */
@Builder
public record GroupChatRoomSummaryResponse(
    Long roomId,             // 채팅방 ID
    String name,             // 부서명 또는 프로젝트명
    RoomType roomType,
    String previewMessage,   // 가장 최근 메시지 본문
    MessageFormat format,    // 메시지 포맷 (TEXT, IMAGE 등)
    int unreadCount,         // 읽지 않은 메시지 수
    LocalDateTime sentAt     // 가장 최근 메시지 시간
){
    public static GroupChatRoomSummaryResponse from(GroupChatRoom room) {
        return new GroupChatRoomSummaryResponse(
                room.getId(),
                room.getName(),
                room.getRoomType(),
                "",         // 추후 채팅 내용 연결 예정
                MessageFormat.TEXT,      // 메시지 형식
                0,                       // 안 읽은 메시지 수
                null                     // 최근 메시지 시간
        );
    }
}