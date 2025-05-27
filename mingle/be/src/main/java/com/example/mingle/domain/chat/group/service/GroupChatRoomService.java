package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomCreateRequest;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomResponse;

import java.util.List;

public interface GroupChatRoomService {

    // 채팅방 생성
    GroupChatRoomResponse createRoom(GroupChatRoomCreateRequest request, Long userId);

    // 현재 유저가 속한 모든 채팅방 조회
    List<GroupChatRoomResponse> findMyRooms(Long userId, ChatScope scope);

    // Project Chat - 진행중 탭
    List<GroupChatRoomResponse> findActiveProjectRooms(Long userId);

    // Project Chat - 보관 탭
    List<GroupChatRoomResponse> findArchivedProjectRooms(Long userId);

    // 채팅방 이름 검색
    List<GroupChatRoomResponse> searchRoomsByKeyword(String keyword);
}
