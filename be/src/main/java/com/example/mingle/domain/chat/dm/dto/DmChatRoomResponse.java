package com.example.mingle.domain.chat.dm.dto;

import com.example.mingle.domain.chat.dm.entity.DmChatRoom;

public record DmChatRoomResponse(
        // roomId → id (일관된 네이밍을 위해 변경)
        Long id,

        // userA → userAId (의미 명확하게)
        Long userAId,

        // userB → userBId (의미 명확하게)
        Long userBId,

        // roomKey (프론트에서 고유 식별자 활용 가능)
        String roomKey
) {
    // 정적 팩토리 메서드 — Entity → DTO 변환
    public static DmChatRoomResponse from(DmChatRoom room) {
        return new DmChatRoomResponse(
                room.getId(),
                room.getUserAId(),
                room.getUserBId(),
                room.getRoomKey()
        );
    }
}
