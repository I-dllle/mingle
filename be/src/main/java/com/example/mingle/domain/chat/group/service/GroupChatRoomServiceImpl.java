package com.example.mingle.domain.chat.group.service;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomCreateRequest;
import com.example.mingle.domain.chat.group.dto.GroupChatRoomResponse;
import com.example.mingle.domain.chat.group.entity.GroupChatRoom;
import com.example.mingle.domain.chat.group.repository.GroupChatRoomRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.projectleaderauthority.entity.ProjectLeaderAuth;
import com.example.mingle.domain.projectleaderauthority.repository.ProjectLeaderAuthRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupChatRoomServiceImpl implements GroupChatRoomService {

    private final GroupChatRoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ProjectLeaderAuthRepository projectLeaderAuthRepository;



    /**
     * 채팅방 생성
     * @param request 채팅방 생성 요청 DTO
     * @param creatorId 방을 생성한 유저 ID
     * @return 생성된 채팅방 정보 응답 DTO
     */
    @Override
    public GroupChatRoomResponse createRoom(GroupChatRoomCreateRequest request, Long creatorId) {

        User user = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        // 부서 채팅방 생성: 관리자만 가능
        if (request.scope() == ChatScope.DEPARTMENT && !user.getRole().isAdmin()) {
            throw new SecurityException("부서 채팅방은 관리자만 생성할 수 있습니다.");
        }

        // 프로젝트 채팅방 생성: 프로젝트 담당자만 가능
        if (request.scope() == ChatScope.PROJECT && !user.isProjectLeader(request.teamId())) {
            throw new SecurityException("프로젝트 채팅방은 해당 프로젝트의 책임자만 생성할 수 있습니다.");
        }

        GroupChatRoom room = GroupChatRoom.builder()
                .teamId(request.teamId())       // 부서 또는 프로젝트 ID
                .roomType(request.roomType())       // 채팅방인지 자료방인지
                .scope(request.scope())     // DEPARTMENT 또는 PROJECT
                .name(request.name())           // 사용자에게 보여지는 이름
                .createdBy(creatorId)       // 생성자 ID
                .build();

        GroupChatRoom saved = roomRepository.save(room);

        return new GroupChatRoomResponse(
                saved.getId(),
                saved.getName(),
                saved.getRoomType(),
                saved.getScope()
        );
    }



    /**
     * 유저가 속한 채팅방 목록 조회
     * @param userId 유저 ID
     * @param scope 조회 기준 (부서/프로젝트)
     * @return 채팅방 목록 응답 DTO 리스트
     */
    @Override
    public List<GroupChatRoomResponse> findMyRooms(Long userId, ChatScope scope) {

        List<GroupChatRoom> rooms;

        // 부서 기준으로 조회
        if (scope == ChatScope.DEPARTMENT) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
            Long departmentId = user.getDepartment().getId();
            rooms = roomRepository.findAllByTeamIdAndScope(departmentId, ChatScope.DEPARTMENT);
        }
        // 프로젝트 기준으로 조회
        else if (scope == ChatScope.PROJECT) {
            // 프로젝트 리더로 등록된 모든 프로젝트 이름 가져옴
            List<String> projectNames = projectLeaderAuthRepository
                    .findAllByUserId(userId)
                    .stream()
                    .map(ProjectLeaderAuth::getProjectName)
                    .toList();

            // 해당 프로젝트 이름으로 등록된 채팅방 가져오기
            rooms = roomRepository.findAllByScopeAndNameIn(ChatScope.PROJECT, projectNames);
        } else {
            throw new IllegalArgumentException("지원하지 않는 scope입니다.");
        }

        return rooms.stream()
                .map(room -> new GroupChatRoomResponse(
                        room.getId(),
                        room.getName(),
                        room.getRoomType(),
                        room.getScope()
                ))
                .toList();
    }

}

