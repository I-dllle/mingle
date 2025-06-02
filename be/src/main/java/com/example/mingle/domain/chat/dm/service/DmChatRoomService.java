package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.dm.dto.DmChatRoomSummaryResponse;
import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import com.example.mingle.domain.user.user.dto.UserSimpleDto;

import java.util.List;

public interface DmChatRoomService {

    // DM 채팅방 생성 or 조회
    DmChatRoom findOrCreateRoom(Long senderId, Long receiverId);

    // 현재 로그인 유저를 제외한 전체 유저 목록 반환
    List<UserSimpleDto> getDmCandidates(Long myId);

    // 채팅방 목록 요약 정보 조회 (최근 메시지 + 읽지 않은 수)
    List<DmChatRoomSummaryResponse> getChatRoomSummaries(Long userId);

    // 특정 채팅방에서 로그인 유저가 아닌 상대방 ID 반환
    Long getReceiverId(Long roomId, Long requesterId);
}
