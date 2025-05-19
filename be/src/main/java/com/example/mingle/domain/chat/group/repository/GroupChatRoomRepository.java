package com.example.mingle.domain.chat.group.repository;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.domain.chat.group.entity.GroupChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupChatRoomRepository extends JpaRepository<GroupChatRoom, Long> {

    // 특정 팀에 속한 채팅방 전체 조회
    List<GroupChatRoom> findAllByTeamId(Long teamId);

    // 특정 팀 + 방 타입(채팅/자료) 기준으로 조회 (예: teamId + RoomType.NORMAL)
    List<GroupChatRoom> findAllByTeamIdAndRoomType(Long teamId, RoomType roomType);

    // 특정 팀 + Scope(DEPARTMENT, PROJECT) 기준 채팅방 조회
    List<GroupChatRoom> findAllByTeamIdAndScope(Long teamId, ChatScope scope);

}
