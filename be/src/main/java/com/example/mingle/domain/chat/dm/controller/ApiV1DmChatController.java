package com.example.mingle.domain.chat.dm.controller;

import com.example.mingle.domain.chat.dm.dto.ChatRoomSummaryResponse;
import com.example.mingle.domain.chat.dm.dto.DmChatMessageResponse;
import com.example.mingle.domain.chat.dm.dto.DmChatRoomCreateRequest;
import com.example.mingle.domain.chat.dm.dto.DmChatRoomResponse;
import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import com.example.mingle.domain.chat.dm.repository.DmChatMessageRepository;
import com.example.mingle.domain.chat.dm.service.DmChatMessageService;
import com.example.mingle.domain.chat.dm.service.DmChatRoomService;
import com.example.mingle.global.security.auth.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dm-chat")
@RequiredArgsConstructor
@Tag(name = "DM Chat API", description = "1:1 DM 채팅 기능")
public class ApiV1DmChatController {

    private final DmChatRoomService dmChatRoomService;
    private final DmChatMessageService dmChatMessageService;
    private final DmChatMessageRepository dmMessageRepository;

    /**
     * POST
     * DM 채팅방 찾거나 새로 생성
     */
    @Operation(
            summary = "DM 채팅방 생성 또는 조회",
            description = """
  DM 채팅방 생성 시 주의사항:

  • 동일한 사용자 쌍은 중복 생성되지 않음 → 항상 하나의 방만 유지됨
  • 자동으로 `roomKey = min(sender, receiver)_max(...)` 방식으로 저장
  • 로그인된 유저만 요청 가능
  """
    )
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
     * 내가 속한 모든 DM 채팅방 요약 정보 반환
     * - 상대 닉네임
     * - 최근 메시지 (content, format, sentAt)
     * - 읽지 않은 메시지 수
     */
    @Operation(
            summary = "DM 채팅방 요약 정보 조회",
            description = """
  내가 참여 중인 모든 DM 채팅방에 대한 요약 정보를 반환합니다.

  • 각 채팅방에 대해 다음 정보를 포함:
    - 상대방 닉네임
    - 가장 최근 메시지 (내용, 시간, 포맷)
    - 읽지 않은 메시지 수

  """
    )
    @GetMapping("/summary")
    public List<ChatRoomSummaryResponse> getChatRoomSummaries(
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
    @Operation(
            summary = "DM 메시지 페이징 조회",
            description = """
  채팅방 입장 시 메시지를 일정 단위로 조회합니다.

  • cursor를 기준으로 이전 메시지 20개씩 조회
  • 최초 진입 시 cursor 생략하면 최신 메시지 기준 조회
  • 무한 스크롤 방식 구현에 적합
  """
    )
    @GetMapping("/{roomId}/messages")
    public List<DmChatMessageResponse> getMessages(
            @PathVariable Long roomId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime cursor
    ) {
        return dmChatMessageService.getMessagesByRoomIdBefore(roomId, cursor);
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
