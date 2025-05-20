package com.example.mingle.domain.chat.group.controller;

import com.example.mingle.domain.chat.group.dto.GroupChatRoomCreateRequest;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomResponse;
import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.group.service.GroupChatRoomService;
import com.example.mingle.global.security.auth.SecurityUser;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/group-chats")
public class ApiV1GroupChatController {

    private final GroupChatRoomService groupChatRoomService;

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
}
