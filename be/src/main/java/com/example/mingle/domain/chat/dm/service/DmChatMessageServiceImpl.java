package com.example.mingle.domain.chat.dm.service;

import com.example.mingle.domain.chat.dm.dto.DmChatMessageResponse;
import com.example.mingle.domain.chat.dm.repository.DmChatRoomRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.websocket.WebSocketSessionManager;
import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;
import com.example.mingle.domain.chat.dm.entity.DmChatRoom;
import com.example.mingle.domain.chat.dm.entity.DmChatMessage;
import com.example.mingle.domain.chat.dm.repository.DmChatMessageRepository;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


@Slf4j
@Service
@RequiredArgsConstructor
public class DmChatMessageServiceImpl implements DmChatMessageService {

    private final DmChatMessageRepository dmRepository;
    private final WebSocketSessionManager sessionManager;
    private final Validator validator;
    private final DmChatRoomRepository dmChatRoomRepository;

    @Override
    public void saveAndSend(ChatMessagePayload payload) {

        // 유효성 검사 (receiverId가 필요한 DIRECT 메시지 확인)
        Set<ConstraintViolation<ChatMessagePayload>> violations = validator.validate(payload);
        if (!violations.isEmpty()) {
            log.warn("유효하지 않은 DM 메시지: {}", violations);
            return;
        }

        // 1) DB 저장
        DmChatMessage message = DmChatMessage.builder()
                .dmRoomId(payload.getRoomId())
                .senderId(payload.getSenderId())
                .receiverId(payload.getReceiverId())
                .format(payload.getFormat())
                .content(payload.getContent())
                .build();
        dmRepository.save(message);

        // 2) 양쪽 유저에게만 WebSocket 전송
        Long senderId   = payload.getSenderId();
        Long receiverId = payload.getReceiverId();

        for (Long userId : new Long[]{senderId, receiverId}) {
            WebSocketSession ws = sessionManager.getSessionByUserId(userId);
            if (ws != null && ws.isOpen()) {
                try {
                    // JSON 직렬화 없이 단순 텍스트 전송 시, 필요하면 ObjectMapper 사용
                    ws.sendMessage(new TextMessage(payload.getContent()));
                } catch (Exception e) {
                    log.warn("DM 전송 실패: userId={}, error={}", userId, e.getMessage());
                }
            }
        }
    }



    @Override
    public void deleteMessage(Long messageId) {
        // 임시 구현 (실제 삭제 처리)
        dmRepository.deleteById(messageId);

        // 로그 추가
        log.info("DM 메시지 삭제됨. messageId={}", messageId);
    }



    @Override
    public void editMessage(Long messageId, String newContent) {
        DmChatMessage message = dmRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다."));
        message.updateContent(newContent); // 메시지에 setter 또는 updateContent 메서드 필요
        log.info("DM 메시지 수정됨. id={}, newContent={}", messageId, newContent);
    }



    @Override
    public String getLatestMessageInRoom(Long dmRoomId) {
        return dmRepository.findTopByDmRoomIdOrderByCreatedAtDesc(dmRoomId)
                .map(DmChatMessage::getContent)
                .orElse("최근 메시지 없음");
    }



    @Override
    public int countUnreadMessages(Long dmRoomId, Long userId) {
        return dmRepository.countByDmRoomIdAndReceiverIdAndIsReadFalse(dmRoomId, userId);
    }



    // 페이징 조회: cursor 이전 메시지 20개를 최신순으로 조회
    // - 최초 요청 시 cursor가 null이면 현재 시각 기준으로 조회
    @Override
    public List<DmChatMessageResponse> getMessagesByRoomIdBefore(Long roomId, LocalDateTime cursor, Long loginUserId) {
        if (cursor == null) {
            cursor = LocalDateTime.now();
        }

        DmChatRoom room = dmChatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_CHATROOM));

        // 로그인 유저가 채팅 참여자가 아니면 차단
        if (!room.isParticipant(loginUserId)) {
            throw new ApiException(ErrorCode.FORBIDDEN_DM_ACCESS);
        }

        return dmRepository
                .findTop20ByDmRoomIdAndCreatedAtBeforeOrderByCreatedAtDesc(roomId, cursor)
                .stream()
                .map(DmChatMessageResponse::from)
                .toList();
    }
}
