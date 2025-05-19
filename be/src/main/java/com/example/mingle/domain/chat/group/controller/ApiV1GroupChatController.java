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
     * 그룹 채팅방 생성 (부서 or 프로젝트 기반)
     * - 관리자 or 프로젝트 리더만 생성 가능
     */
    @PostMapping
    public GroupChatRoomResponse createGroupChatRoom(
            @RequestBody GroupChatRoomCreateRequest request,
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return groupChatRoomService.createRoom(request, loginUser.getId());
    }



    /**
     * 내가 속한 그룹 채팅방 전체 조회
     * - scope=DEPARTMENT or PROJECT
     */
    @GetMapping
    public List<GroupChatRoomResponse> getMyGroupChatRooms(
            @RequestParam ChatScope scope,
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return groupChatRoomService.findMyRooms(loginUser.getId(), scope);
    }
}
