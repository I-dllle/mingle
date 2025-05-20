package com.example.mingle.domain.chat.dm.controller;

import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.domain.chat.dm.dto.DmChatMessageResponse;
import com.example.mingle.domain.chat.dm.dto.DmChatRoomCreateRequest;
import com.example.mingle.domain.chat.dm.dto.DmChatRoomResponse;
import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import com.example.mingle.domain.chat.dm.repository.DmChatMessageRepository;
import com.example.mingle.domain.chat.dm.service.DmChatRoomService;
import com.example.mingle.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dm-chat")
@RequiredArgsConstructor
public class ApiV1DmChatController {

    private final DmChatRoomService dmChatRoomService;
    private final DmChatMessageRepository dmMessageRepository;

    /**
     * POST
     * DM 채팅방 찾거나 새로 생성
     */
    @PostMapping("/room")
    public DmChatRoomResponse getOrCreateRoom(
            @RequestBody DmChatRoomCreateRequest request,
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        DmChatRoom room = dmChatRoomService.findOrCreateRoom(loginUser.getId(), request.receiverId());
        return DmChatRoomResponse.from(room);
    }



    /**
     * GET
     * 채팅방 ID 기준 메시지 전체 조회 (오름차순)
     */
    @GetMapping("/{roomId}/messages")
    public List<DmChatMessageResponse> getMessages(
            @PathVariable Long roomId
    ) {
        List<DmChatMessage> messages = dmMessageRepository.findByDmRoomIdOrderByCreatedAtAsc(roomId);
        return messages.stream()
                .map(DmChatMessageResponse::from)
                .toList();
    }



    // 🟠 [DELETE] 메시지 삭제
    // @DeleteMapping("/messages/{messageId}")
    // public void deleteMessage(@PathVariable Long messageId) { ... } // TODO




    // [PATCH] 메시지 수정
    // @PatchMapping("/messages/{messageId}")
    // public void editMessage(...) { ... } // TODO



    // [GET] 채팅방 최근 메시지
    // @GetMapping("/{roomId}/latest-message")
    // public String getLatestMessage(@PathVariable Long roomId) { ... } // TODO



    // [GET] 읽지 않은 메시지 수
    // @GetMapping("/{roomId}/unread-count")
    // public int getUnreadCount(...) { ... } // TODO

}
