package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.dm.dto.ChatRoomSummaryResponse;
import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import com.example.mingle.domain.chat.dm.repository.DmChatMessageRepository;
import com.example.mingle.domain.chat.dm.repository.DmChatRoomRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DmChatRoomServiceImpl implements DmChatRoomService {

    private final DmChatRoomRepository dmChatRoomRepository;
    private final DmChatMessageRepository dmChatMessageRepository;
    private final UserRepository userRepository;

    /**
     * senderId와 receiverId 기준으로 기존 DM 채팅방이 존재하는지 확인하고,
     * 없으면 새로 생성하여 반환한다.
     */
    @Override
    public DmChatRoom findOrCreateRoom(Long senderId, Long receiverId) {
        // 항상 작은 ID가 앞으로 오도록 정렬
        // userId가 더 작은 사람이 userAId, 큰 사람이 userBId로 들어가게 만드는 로직
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



    /**
     * 채팅방 목록 요약 정보 조회 (프론트 목록용)
     * - 최근 메시지, 읽지 않은 수, 상대방 닉네임 포함
     */
    @Override
    public List<ChatRoomSummaryResponse> getChatRoomSummaries(Long userId) {
        List<DmChatRoom> myRooms = dmChatRoomRepository.findByUserAIdOrUserBId(userId, userId); // 내가 속한 채팅방 전체 조회

        return myRooms.stream().map(room -> {
            Long opponentId = room.getUserAId().equals(userId) ? room.getUserBId() : room.getUserAId();
            User opponent = userRepository.findById(opponentId).orElse(null);

            // 가장 최근 메시지
            DmChatMessage latestMessage = dmChatMessageRepository
                    .findTopByDmRoomIdOrderByCreatedAtDesc(room.getId())
                    .orElse(null);

            // 읽지 않은 메시지 수
            int unreadCount = dmChatMessageRepository
                    .countByDmRoomIdAndReceiverIdAndIsReadFalse(room.getId(), userId);

            return ChatRoomSummaryResponse.builder()
                    .roomId(room.getId())
                    .opponentNickname(opponent != null ? opponent.getNickname() : "알 수 없음")
                    .previewMessage(latestMessage != null ? latestMessage.getContent() : "(메시지 없음)")
                    .format(latestMessage != null ? latestMessage.getFormat() : null)
                    .unreadCount(unreadCount)
                    .sentAt(latestMessage != null ? latestMessage.getCreatedAt() : null)
                    .build();
        }).toList();
    }



    /**
     * 특정 채팅방에서 로그인 유저가 아닌 상대방 ID 반환
     * - 프론트에서 receiverId 조회할 때 사용
     */
    @Override
    public Long getReceiverId(Long roomId, Long requesterId) {
        DmChatRoom room = dmChatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_CHATROOM));

        if (room.getUserAId().equals(requesterId)) {
            return room.getUserBId();
        } else if (room.getUserBId().equals(requesterId)) {
            return room.getUserAId();
        } else {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }
    }
}
