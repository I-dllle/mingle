package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomCreateRequest;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomResponse;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomSummaryResponse;

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

    /**
     * 채팅방 요약 목록 조회 (프론트 전용)
     * - 기본 채팅 목록 화면에 보여줄 요약 정보 (이름, 미리보기 메시지, 안 읽은 메시지 수 등)
     * - scope(DEPARTMENT 또는 PROJECT)에 따라 부서 또는 프로젝트 채팅방을 구분해서 조회
     */
    List<GroupChatRoomSummaryResponse> getGroupChatRoomSummaries(Long userId, ChatScope scope);
}
