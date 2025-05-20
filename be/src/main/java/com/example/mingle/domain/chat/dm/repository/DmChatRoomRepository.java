package com.example.mingle.domain.chat.dm.repository;

import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DmChatRoomRepository extends JpaRepository<DmChatRoom, Long> {
    Optional<DmChatRoom> findByRoomKey(String roomKey);
}
