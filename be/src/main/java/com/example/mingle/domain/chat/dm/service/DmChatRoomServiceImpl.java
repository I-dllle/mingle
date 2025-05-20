package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import com.example.mingle.domain.chat.dm.repository.DmChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DmChatRoomServiceImpl implements DmChatRoomService {

    private final DmChatRoomRepository dmChatRoomRepository;

    /**
     * senderId와 receiverId 기준으로 기존 DM 채팅방이 존재하는지 확인하고,
     * 없으면 새로 생성하여 반환한다.
     */
    @Override
    public DmChatRoom findOrCreateRoom(Long senderId, Long receiverId) {
        // 항상 작은 ID가 앞으로 오도록 정렬
        Long userAId = Math.min(senderId, receiverId);
        Long userBId = Math.max(senderId, receiverId);
        String roomKey = userAId + "_" + userBId;

        return dmChatRoomRepository.findByRoomKey(roomKey)
                .orElseGet(() -> {
                    DmChatRoom newRoom = DmChatRoom.builder()
                            .userAId(userAId)
                            .userBId(userBId)
                            .roomKey(roomKey)
                            .build();
                    return dmChatRoomRepository.save(newRoom);
                });
    }
}
