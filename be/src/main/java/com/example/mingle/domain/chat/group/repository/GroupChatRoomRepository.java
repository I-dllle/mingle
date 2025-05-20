package com.example.mingle.domain.chat.group.repository;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.domain.chat.group.entity.GroupChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface GroupChatRoomRepository extends JpaRepository<GroupChatRoom, Long> {

    // -------------------------------
    // TEAM CHAT 탭 (부서 채팅방)
    // -------------------------------

    // [Team Chat - 채팅방 목록] 로그인 유저의 부서 teamId + scope = DEPARTMENT
    List<GroupChatRoom> findAllByTeamIdAndScope(Long teamId, ChatScope scope);

    // [Team Chat - 자료방 탭] 부서 teamId + 자료방(RoomType.ARCHIVE)
    List<GroupChatRoom> findAllByTeamIdAndRoomType(Long teamId, RoomType roomType);

    // (추후 구현) 부서 teamId + 자료방(RoomType.ARCHIVE) + scope까지 걸러서 더 정밀 조회
    List<GroupChatRoom> findAllByTeamIdAndRoomTypeAndScope(Long teamId, RoomType roomType, ChatScope scope); // TODO


    // -------------------------------
    // PROJECT CHAT 탭 (진행중 / 보관 / 자료방)
    // -------------------------------

    // [Project Chat - 진행중 탭] 유저가 리더인 프로젝트 중 종료일이 아직 안 지난 방
    List<GroupChatRoom> findAllByTeamIdInAndScopeAndProjectEndDateAfterOrProjectEndDateIsNull(
            List<Long> teamIds, ChatScope scope, LocalDate today
    );

    // [Project Chat - 보관함 탭] 종료일이 지난 프로젝트 채팅방
    List<GroupChatRoom> findAllByTeamIdInAndScopeAndProjectEndDateBefore(
            List<Long> teamIds, ChatScope scope, LocalDate today
    );

    // [Project Chat - 전체 목록] 진행중/보관 구분 없이 프로젝트 scope 전체 조회
    List<GroupChatRoom> findAllByTeamIdInAndScope(List<Long> teamIds, ChatScope scope);

    // (추후 구현) 유저가 리더인 프로젝트들 중 자료방(RoomType.ARCHIVE)만 필터링
    List<GroupChatRoom> findAllByTeamIdInAndRoomTypeAndScope(List<Long> teamIds, RoomType roomType, ChatScope scope); // TODO


    // -------------------------------
    // 채팅방 검색 기능 (상단 검색창)
    // -------------------------------

    // [검색창] 이름에 키워드가 포함된 모든 채팅방 검색 (Team/Project 공통)
    List<GroupChatRoom> findAllByNameContaining(String keyword);


    // -------------------------------
    // 특수 / 내부용 / 확장용 기능
    // -------------------------------

    // [내부/관리용] Scope 없이 특정 팀의 모든 채팅방 일괄 조회 (삭제 등 특수 목적)
    List<GroupChatRoom> findAllByTeamId(Long teamId);

    // (추후 구현) 내가 만든 채팅방만 필터링 (예: "내가 만든 채팅방 목록")
    List<GroupChatRoom> findAllByCreatedBy(Long userId); // TODO

}
