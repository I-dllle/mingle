package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.domain.chat.group.entity.GroupChatRoom;

import java.time.LocalDate;

public record GroupChatRoomResponse(
        Long id,
        String name,
        RoomType roomType,      // 채팅방 / 자료방
        ChatScope scope,     // DEPARTMENT / PROJECT
        LocalDate projectEndDate     // 종료일: 프론트에서 보관 여부 구분용
) {
    /**
     * Entity → Response DTO 변환 메서드
     * Service 또는 Controller 단에서
     * GroupChatRoom 엔티티를 프론트로 반환하기 위한
     * GroupChatRoomResponse 형태로 매핑할 때 사용됨
     */
    public static GroupChatRoomResponse from(GroupChatRoom room) {
        return new GroupChatRoomResponse(
                room.getId(),
                room.getName(),
                room.getRoomType(),
                room.getScope(),
                room.getProjectEndDate()
        );
    }
}
