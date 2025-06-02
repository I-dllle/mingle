package com.example.mingle.domain.chat.dm.controller;

import com.example.mingle.domain.chat.dm.dto.DmChatRoomSummaryResponse;
import com.example.mingle.domain.chat.dm.dto.DmChatMessageResponse;
import com.example.mingle.domain.chat.dm.dto.DmChatRoomCreateRequest;
import com.example.mingle.domain.chat.dm.dto.DmChatRoomResponse;
import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import com.example.mingle.domain.chat.dm.repository.DmChatMessageRepository;
import com.example.mingle.domain.chat.dm.service.DmChatMessageService;
import com.example.mingle.domain.chat.dm.service.DmChatRoomService;
import com.example.mingle.domain.user.user.dto.UserSimpleDto;
import com.example.mingle.global.security.auth.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dm-chat")
@RequiredArgsConstructor
public class ApiV1DmChatController {

    private final DmChatRoomService dmChatRoomService;
    private final DmChatMessageService dmChatMessageService;
    private final DmChatMessageRepository dmMessageRepository;

    /**
     * DM 시작 가능한 유저 목록 조회 (본인 제외)
     */
    @GetMapping("/candidates")
    public List<UserSimpleDto> getDmCandidates(
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return dmChatRoomService.getDmCandidates(loginUser.getId());
    }



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
     * 특정 DM 채팅방의 상대방(receiverId) 조회
     */
    @GetMapping("/room/{roomId}/receiver")
    public Long getReceiverId(
            @PathVariable Long roomId,
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return dmChatRoomService.getReceiverId(roomId, loginUser.getId());
    }



    /**
     * GET
     * 내가 속한 모든 DM 채팅방 요약 정보 반환
     * - 상대 닉네임
     * - 최근 메시지 (content, format, sentAt)
     * - 읽지 않은 메시지 수
     */
    @GetMapping("/summary")
    public List<DmChatRoomSummaryResponse> getChatRoomSummaries(
            @AuthenticationPrincipal SecurityUser loginUser
    ) {
        return dmChatRoomService.getChatRoomSummaries(loginUser.getId());
    }



    /**
     * GET
     * DM 채팅방 메시지 페이징 조회 (최신순 20개씩)
     * - 최초 입장 시 cursor 없이 요청 → 최신 20개
     * - 이후 스크롤 시 가장 오래된 메시지 시간(cursor) 기준 이전 메시지 20개씩 불러오기
     */
    @GetMapping("/{roomId}/messages")
    public List<DmChatMessageResponse> getMessages(
            @PathVariable Long roomId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime cursor
    ) {
        return dmChatMessageService.getMessagesByRoomIdBefore(roomId, cursor);
    }



    // [DELETE] 메시지 삭제
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
