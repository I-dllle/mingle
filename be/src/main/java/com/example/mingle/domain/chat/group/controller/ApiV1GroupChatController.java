package com.example.mingle.domain.chat.group.controller;

import com.example.mingle.domain.chat.group.dto.GroupChatRoomCreateRequest;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomResponse;
import com.example.mingle.domain.chat.group.dto.GroupChatMessageResponse;
import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.group.service.GroupChatRoomService;
import com.example.mingle.domain.chat.group.service.GroupChatMessageService;
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
@RequiredArgsConstructor
@RequestMapping("/api/v1/group-chats")
@Tag(name = "Group Chat API", description = "부서 및 프로젝트 그룹 채팅 기능")
public class ApiV1GroupChatController {

    private final GroupChatRoomService groupChatRoomService;
    private final GroupChatMessageService groupChatMessageService;

    /**
     * POST
     * 채팅방 생성 (Team Chat / Project Chat 공통)
     */
    @Operation(
            summary = "그룹 채팅방 생성",
            description = """
  * 채팅방 생성 시 주의사항:

  • `scope: DEPARTMENT` ➝ 관리자만 생성 가능 (`UserRole.ADMIN`)
  • `scope: PROJECT` ➝ 해당 프로젝트 리더만 생성 가능 (`ProjectLeaderAuth` 등록 필요)
  • 프로젝트 종료일은 `scope: PROJECT`일 때만 필요

  * 권한 없을 경우 403 Forbidden 반환됨
  """
    )
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
    @Operation(
            summary = "내 그룹 채팅방 목록 조회",
            description = """
    로그인한 사용자가 속한 부서/프로젝트 채팅방 전체 조회

    • 요청 파라미터 `scope`를 기준으로 분기
      - `DEPARTMENT`: 부서 채팅방 목록
      - `PROJECT`: 프로젝트 채팅방 목록
    • `scope`는 필수이며, 소속되지 않은 경우 빈 배열 반환
    """
    )
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
    @Operation(
            summary = "진행 중인 프로젝트 채팅방 조회",
            description = """
    종료일이 현재 날짜 이후인 프로젝트 채팅방만 조회

    • scope = PROJECT 조건 고정
    • 부서 채팅방(DEPARTMENT)은 해당되지 않음
    """
    )
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
    @Operation(
            summary = "보관된 프로젝트 채팅방 조회",
            description = """
    종료일이 지난 프로젝트 채팅방만 조회

    • scope = PROJECT 조건 고정
    • 현재 날짜(LocalDate.now())보다 종료일이 이전이면 보관 대상
    """
    )
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
    @Operation(
            summary = "그룹 채팅방 이름 검색",
            description = """
    채팅방 이름 기준으로 부분 일치 검색을 수행합니다.

    • `scope`는 따로 받지 않으며, 전체 그룹 채팅방 대상
    • 대소문자 구분 없이 LIKE 검색
    • 정렬 기준은 최신 생성순
    """
    )
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
    @Operation(
            summary = "그룹 채팅 메시지 페이징 조회",
            description = """
    해당 채팅방의 메시지를 일정 단위로 조회합니다 (무한 스크롤 대응)

    • query parameter: `cursor` (optional)
      - 생략 시: 현재 시각 기준 최신 메시지 20개 조회
      - 포함 시: 해당 시각보다 이전 메시지 20개씩 조회
    • 메시지는 항상 최신순 정렬되어 내려가며, 응답에서는 오래된 순으로 reverse 처리
    """
    )
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
