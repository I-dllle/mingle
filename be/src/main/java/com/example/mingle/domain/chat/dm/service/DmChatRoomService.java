package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.dm.dto.ChatRoomSummaryResponse;
import com.example.mingle.domain.chat.dm.entity.DmChatRoom;

import java.util.List;

public interface DmChatRoomService {

    // DM 채팅방 생성 or 조회
    DmChatRoom findOrCreateRoom(Long senderId, Long receiverId);

    // 채팅방 목록 요약 정보 조회 (최근 메시지 + 읽지 않은 수)
    List<ChatRoomSummaryResponse> getChatRoomSummaries(Long userId);
}
