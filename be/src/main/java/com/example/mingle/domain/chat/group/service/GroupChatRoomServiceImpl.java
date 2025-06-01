package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomCreateRequest;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomResponse;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomSummaryResponse;
import com.example.mingle.domain.chat.group.entity.GroupChatRoom;
import com.example.mingle.domain.chat.group.repository.GroupChatRoomRepository;
import com.example.mingle.domain.chat.group.repository.GroupChatMessageRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.projectleaderauthority.entity.ProjectLeaderAuth;
import com.example.mingle.domain.projectleaderauthority.entity.Project;
import com.example.mingle.domain.projectleaderauthority.repository.ProjectLeaderAuthRepository;
import com.example.mingle.domain.projectleaderauthority.service.ProjectLeaderAuthService;
import com.example.mingle.domain.projectleaderauthority.service.ProjectService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupChatRoomServiceImpl implements GroupChatRoomService {

    private final GroupChatRoomRepository roomRepository;
    private final GroupChatMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ProjectLeaderAuthRepository projectLeaderAuthRepository;
    private final ProjectLeaderAuthService projectLeaderAuthService;
    private final ProjectService projectService;


    /**
     * 그룹 채팅방 생성 (부서 또는 프로젝트)
     */
    @Override
    public GroupChatRoomResponse createRoom(GroupChatRoomCreateRequest request, Long creatorId) {

        User user = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        // 부서 채팅방 생성: 관리자만 가능
        if (request.scope() == ChatScope.DEPARTMENT && !user.getRole().isAdmin()) {
            throw new SecurityException("부서 채팅방은 관리자만 생성할 수 있습니다.");
        }

        // 종료일 선언
        LocalDate endDate = request.projectEndDate();

        // 프로젝트 채팅방 생성: 프로젝트 담당자만 가능
        if (request.scope() == ChatScope.PROJECT) {
            if (!projectLeaderAuthService.isLeader(request.teamId(), creatorId)) {
                throw new SecurityException("프로젝트 채팅방은 해당 프로젝트의 책임자만 생성할 수 있습니다.");
            }

            // 종료일을 프로젝트 엔티티에서 가져오기
            Project project = projectService.findByIdOrThrow(request.teamId());
            endDate = project.getEndDate(); // 기존 request.projectEndDate() 대신
        }

        // 일반 채팅방 생성
        GroupChatRoom saved = roomRepository.save(GroupChatRoom.builder()
                .teamId(request.teamId())       // 부서 또는 프로젝트 ID
                .roomType(request.roomType())       // 채팅방인지 자료방인지
                .scope(request.scope())     // DEPARTMENT 또는 PROJECT
                .name(request.name())           // 사용자에게 보여지는 이름
                .createdBy(creatorId)       // 생성자 ID
                .projectEndDate(endDate) // null 가능
                .build());

        // 일반 채팅방인 경우, 같은 팀 ID로 자료방(ARCHIVE)도 생성
        if (request.roomType() == RoomType.NORMAL) {
            GroupChatRoom archiveRoom = GroupChatRoom.builder()
                    .teamId(request.teamId())
                    .roomType(RoomType.ARCHIVE)
                    .scope(request.scope())
                    .name("[자료] " + request.name()) // 예: "[자료] 팀A 채팅방"
                    .createdBy(creatorId)
                    .projectEndDate(endDate)
                    .build();

            roomRepository.save(archiveRoom);
        }

        return GroupChatRoomResponse.from(saved);
    }



    /**
     * 기존 API 호환용: 채팅방 전체 목록 조회
     * - 프론트에서 요약 아닌 전체 정보가 필요한 경우
     */
    @Override
    public List<GroupChatRoomResponse> findMyRooms(Long userId, ChatScope scope) {
        List<GroupChatRoom> rooms = findRoomsByScope(userId, scope);
        return rooms.stream().map(GroupChatRoomResponse::from).toList();
    }



    /**
     * 채팅방 요약 목록 (프론트용) 반환
     * - 각 채팅방에 대해: 최근 메시지 / 안 읽은 메시지 수 / 보낸 시각을 포함한 요약 응답 생성
     */
    @Override
    public List<GroupChatRoomSummaryResponse> getGroupChatRoomSummaries(Long userId, ChatScope scope) {

        List<GroupChatRoom> rooms = findRoomsByScope(userId, scope);

        return rooms.stream().map(room -> {
            // 가장 최근 메시지 1개 조회
            var latestMessage = messageRepository
                    .findTopByChatRoomIdOrderByCreatedAtDesc(room.getId())
                    .orElse(null);

            // 해당 채팅방에서 내가 읽지 않은 메시지 수 조회
            int unreadCount = messageRepository
                    .countByChatRoomIdAndSenderIdNotAndIsReadFalse(room.getId(), userId);

            // builder 직접 사용하여 원하는 필드 세팅
            return GroupChatRoomSummaryResponse.builder()
                    .roomId(room.getId())
                    .name(room.getName())
                    .roomType(room.getRoomType())
                    .previewMessage(latestMessage != null ? latestMessage.getContent() : "")
                    .format(latestMessage != null ? latestMessage.getFormat() : MessageFormat.TEXT)
                    .unreadCount(unreadCount)
                    .sentAt(latestMessage != null ? latestMessage.getCreatedAt() : null)
                    .build();
        }).toList();
    }

    /**
     * 중복 제거를 위한 내부 메서드
     * - scope 기준으로 팀/프로젝트 채팅방 조회
     * - 부서인 경우: departmentId 기반
     * - 프로젝트인 경우: 내가 속한 모든 프로젝트
     */
    private List<GroupChatRoom> findRoomsByScope(Long userId, ChatScope scope) {
        // 부서 기준으로 조회
        if (scope == ChatScope.DEPARTMENT) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
            Long departmentId = user.getDepartment().getId();
            return roomRepository.findAllByTeamIdAndScope(departmentId, ChatScope.DEPARTMENT);
        }
        // 프로젝트 기준으로 조회
        else if (scope == ChatScope.PROJECT) {
            // 1. 유저가 리더인 모든 프로젝트 ID 리스트 조회
            List<Long> projectIds = projectLeaderAuthRepository.findAllByUserId(userId)
                    .stream().map(auth -> auth.getProject().getId()).toList();
            // 2. 여러 프로젝트 ID를 한 번에 조건으로 조회 (scope: PROJECT 고정)
            return roomRepository.findAllByTeamIdInAndScope(projectIds, ChatScope.PROJECT);
        } else {
            throw new IllegalArgumentException("지원하지 않는 scope입니다.");
        }
    }



    /**
     * PROJECT CHAT 탭 - [진행중] 탭
     * - 종료일이 안 지났거나 null인 프로젝트 채팅방만
     */
    public List<GroupChatRoomResponse> findActiveProjectRooms(Long userId) {
        List<Long> projectIds = projectLeaderAuthRepository.findAllByUserId(userId)
                .stream().map(auth -> auth.getProject().getId()).toList();

        List<GroupChatRoom> rooms = roomRepository
                .findAllByTeamIdInAndScopeAndProjectEndDateAfterOrProjectEndDateIsNull(
                        projectIds, ChatScope.PROJECT, LocalDate.now());

        return rooms.stream().map(GroupChatRoomResponse::from).toList();
    }

    /**
     * PROJECT CHAT 탭 - [보관함] 탭
     * - 종료일이 지난 프로젝트 채팅방만
     */
    public List<GroupChatRoomResponse> findArchivedProjectRooms(Long userId) {
        List<Long> projectIds = projectLeaderAuthRepository.findAllByUserId(userId)
                .stream().map(auth -> auth.getProject().getId()).toList();

        List<GroupChatRoom> rooms = roomRepository
                .findAllByTeamIdInAndScopeAndProjectEndDateBefore(
                        projectIds, ChatScope.PROJECT, LocalDate.now());

        return rooms.stream().map(GroupChatRoomResponse::from).toList();
    }

    /**
     * TEAM/PROJECT CHAT 공통 - [검색창]
     * - 채팅방 이름 기준 키워드 포함 검색
     */
    public List<GroupChatRoomResponse> searchRoomsByKeyword(String keyword) {
        return roomRepository.findAllByNameContaining(keyword)
                .stream().map(GroupChatRoomResponse::from).toList();
    }

}

