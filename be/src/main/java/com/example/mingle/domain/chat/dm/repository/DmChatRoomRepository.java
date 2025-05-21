package com.example.mingle.domain.chat.dm.repository;

import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DmChatRoomRepository extends JpaRepository<DmChatRoom, Long> {

    // roomKey 기반으로 중복 방 체크
    Optional<DmChatRoom> findByRoomKey(String roomKey);

    // 특정 사용자가 속한 DM 채팅방 전체 조회
    // - A 또는 B로 들어가 있는 모든 방을 반환
    List<DmChatRoom> findByUserAIdOrUserBId(Long userAId, Long userBId);
}
