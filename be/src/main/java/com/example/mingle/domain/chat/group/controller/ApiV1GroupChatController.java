package com.example.mingle.domain.chat.group.controller;

import com.example.mingle.domain.chat.group.dto.GroupChatRoomCreateRequest;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomResponse;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomSummaryResponse;
import com.example.mingle.domain.chat.group.dto.GroupChatMessageResponse;
import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.group.service.GroupChatRoomService;
import com.example.mingle.domain.chat.group.service.GroupChatMessageService;
import com.example.mingle.global.security.auth.SecurityUser;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/group-chats")
public class ApiV1GroupChatController {

    private final GroupChatRoomService groupChatRoomService;
    private final GroupChatMessageService groupChatMessageService;

    /**
     * POST
     * 채팅방 생성 (Team Chat / Project Chat 공통)
     */
    @PostMapping
    public GroupChatRoomResponse createGroupChatRoom(
            @RequestBody GroupChatRoomCreateRequest request,
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return groupChatRoomService.createRoom(request, loginUser.getId());
    }



    /**
     * GET
     * 내 채팅방 목록 조회
     * - Team Chat: scope = DEPARTMENT
     * - Project Chat 기본: scope = PROJECT
     */
    @GetMapping
    public List<GroupChatRoomResponse> getMyGroupChatRooms(
            @RequestParam ChatScope scope,
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return groupChatRoomService.findMyRooms(loginUser.getId(), scope);
    }



    /**
     * GET
     * 채팅방 요약 목록 조회 (자료방/채팅방 구분된 요약 UI용)
     * - 프론트: 사이드바에서 채팅방 리스트 간략히 띄우는 용도
     * - 반환 형태: GroupChatRoomSummaryResponse (roomId, name, previewMessage 등)
     */
    @GetMapping("/summaries")
    public List<GroupChatRoomSummaryResponse> getGroupChatRoomSummaries(
            @RequestParam ChatScope scope,
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return groupChatRoomService.getGroupChatRoomSummaries(loginUser.getId(), scope);
    }



    /**
     * GET
     * 진행중인 프로젝트 채팅방만 조회 (Project Chat - 진행중 탭)
     */
    @GetMapping("/active")
    public List<GroupChatRoomResponse> getActiveProjectRooms(
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return groupChatRoomService.findActiveProjectRooms(loginUser.getId());
    }



    /**
     * GET
     * 보관된 프로젝트 채팅방만 조회 (Project Chat - 보관 탭)
     */
    @GetMapping("/archived")
    public List<GroupChatRoomResponse> getArchivedProjectRooms(
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return groupChatRoomService.findArchivedProjectRooms(loginUser.getId());
    }



    /**
     * GET
     * 채팅방 이름 검색 (Team/Project 공통 상단 검색창)
     */
    @GetMapping("/search")
    public List<GroupChatRoomResponse> searchRooms(
            @RequestParam String keyword
    ) {
        return groupChatRoomService.searchRoomsByKeyword(keyword);
    }


    /**
     * GET
     * 그룹 채팅 메시지 페이징 조회 API
     * 채팅방 입장 시 최초 메시지 조회 / 스크롤 위로 이동 시 이전 메시지 더 불러오기 용
     */
    @GetMapping("/{roomId}/messages")
    public List<GroupChatMessageResponse> getMessages(
            @PathVariable Long roomId,

            // cursor 기준 시각보다 이전 메시지 20개를 최신순으로 조회합니다.
            // - 생략 시 현재 시간(LocalDateTime.now()) 이전 메시지를 조회 (최신 메시지 20개)
            // - cursor가 있을 경우: 해당 시각 이전 메시지부터 조회 (스크롤 위로)
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime cursor
    ) {
        return groupChatMessageService.getMessagesByRoomIdBefore(roomId, cursor);
    }
}
