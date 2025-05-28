package com.example.mingle.domain.chat.common.socket;

import com.example.mingle.domain.chat.archive.entity.ArchiveItem;
import com.example.mingle.domain.chat.archive.repository.ArchiveItemRepository;
import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;
import com.example.mingle.domain.chat.common.dto.WebSocketAuthDto;
import com.example.mingle.domain.chat.common.enums.ChatRoomType;
import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.domain.chat.common.util.ChatUtil;
import com.example.mingle.domain.chat.dm.service.DmChatMessageService;
import com.example.mingle.domain.chat.group.service.GroupChatMessageService;
import com.example.mingle.domain.user.presence.service.PresenceService;
import com.example.mingle.domain.user.user.entity.PresenceStatus;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor // DI 자동 주입 (objectMapper, groupChatMessageService)
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // 클라이언트로부터 받은 JSON 문자열을 Java 객체로 변환할 때 사용
    private final ObjectMapper objectMapper;

    // 수신한 채팅 메시지를 저장하고 브로드캐스트하는 서비스
    private final GroupChatMessageService groupChatMessageService;

    private final DmChatMessageService dmChatMessageService;

    // 자료 조회용
    private final ArchiveItemRepository archiveItemRepository;

    // 유효성 검사를 위한 Validator
    private final Validator validator;

    // 활동 상태용
    private final PresenceService presenceService;
    private final UserRepository userRepository;



    /**
     * 클라이언트가 WebSocket에 처음 연결됐을 때 실행
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket 연결됨: sessionId = {}", session.getId());

        // 활동 상태를 수동으로 변환한 유저 때문에 추가함.
        WebSocketAuthDto auth = (WebSocketAuthDto) session.getAttributes().get("auth");
        if (auth == null) {
            log.warn("WebSocket 인증 정보 없음");
            return;
        }

        Long userId = auth.getUserId();

        // DB에서 저장된 수동 상태 불러오기
        User user = userRepository.findById(userId).orElseThrow(() ->
                new ApiException(ErrorCode.USER_NOT_FOUND)
        );

        PresenceStatus savedStatus = user.getPresence();

        if (savedStatus == PresenceStatus.DO_NOT_DISTURB || savedStatus == PresenceStatus.AWAY) {
            // 수동 상태 복원
            presenceService.setManualStatus(userId, savedStatus);
            log.info("🔒 수동 Presence 복원: userId={}, status={}", userId, savedStatus);
        } else {
            // 자동 상태로 진입
            presenceService.setStatus(userId, PresenceStatus.ONLINE);
            presenceService.startAwayTimer(userId);
            log.info("🟢 Presence 시작: userId={}, status=ONLINE", userId);
        }

        // TODO: 인증 처리 예정 (WebSocketAuthDto, SessionManager 연동)

        // TODO: SYSTEM 메시지 전송 예정
        // 추후 인증 완료 후 actor 정보 획득 필요
        // 예: nickname = "홍길동", roomId = 123L
        //
        // 가정: 인증 처리를 마쳤고 roomId와 nickname을 알 수 있다고 가정
        //
        // String nickname = "홍길동"; // 인증된 사용자에서 가져옴
        // Long roomId = ...;          // 연결된 채팅방 정보

        // groupChatMessageService.sendSystemMessage("[" + nickname + "]님이 입장했습니다.", roomId);
    }



    /**
     * 클라이언트가 메시지를 전송했을 때 실행
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        log.info("메시지 수신: sessionId = {}, payload = {}", session.getId(), message.getPayload());

        // 활동 상태를 하나의 웹소켓 사용을 위해서 코드 추가
        String presencePayload = message.getPayload();
        WebSocketAuthDto auth = (WebSocketAuthDto) session.getAttributes().get("auth");
        if (auth == null) {
            log.warn("WebSocket 인증 정보 없음");
            return;
        }
        Long userId = auth.getUserId();

        // 1. Presence 메시지 먼저 필터링
        if ("ping".equals(presencePayload)) {
            presenceService.handlePing(userId);
            return;
        }

        if ("tab_hidden".equals(presencePayload)) {
            presenceService.setStatus(userId, PresenceStatus.AWAY);
            presenceService.cancelAwayTimer(userId);
            return;
        }

        try {
            // 1단계: JSON 문자열을 ChatMessagePayload 객체로 변환
            ChatMessagePayload payload = objectMapper.readValue(message.getPayload(), ChatMessagePayload.class);

            // 2단계: 유효성 검사
            Set<ConstraintViolation<ChatMessagePayload>> violations = validator.validate(payload);
            if (!violations.isEmpty()) {
                log.warn("유효하지 않은 메시지: {}", violations);
                session.sendMessage(new TextMessage("메시지 형식 오류"));
                return;
            }

            // 3단계: 메시지 저장 + 같은 채팅방 유저에게 전송 (Service에 위임)
            // 메시지 타입에 따라 서비스 위임
            // format=ARCHIVE 메시지 수신 시 분기 처리
            if (payload.getFormat() == MessageFormat.ARCHIVE) {
                handleArchiveMessage(payload, session);
                return;
            }

            // 일반 메시지 분기
            if (payload.getRoomType() == ChatRoomType.DIRECT) {
                dmChatMessageService.saveAndSend(payload);
            } else {
                groupChatMessageService.saveAndBroadcast(payload);
            }

        } catch (Exception e) {
            log.error("메시지 처리 중 예외 발생", e);
            // 예외 발생 시 WebSocket 강제 종료
            try {
                session.close(CloseStatus.SERVER_ERROR);
            } catch (Exception closeEx) {
                log.error("세션 종료 중 예외 발생", closeEx);
            }
        }
    }



    /**
     * 연결이 끊어졌을 때 실행 (예: 브라우저 종료, 네트워크 끊김)
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // 활동 상태를 위해서 코드 추가
        WebSocketAuthDto auth = (WebSocketAuthDto) session.getAttributes().get("auth");
        if (auth != null) {
            presenceService.setStatus(auth.getUserId(), PresenceStatus.OFFLINE);
            presenceService.cancelAwayTimer(auth.getUserId());
            log.info("OFFLINE 처리: userId={}", auth.getUserId());
        }

        log.info("WebSocket 연결 종료: sessionId = {}", session.getId());
        // TODO: 세션 정리 예정 (SessionManager)
    }



    /**
     * 통신 중 에러 발생 시 실행
     */
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.warn("WebSocket 에러: sessionId = {}, error = {}", session.getId(), exception.getMessage());
    }



    // format=ARCHIVE 메시지 수신 처리 메서드
    private void handleArchiveMessage(ChatMessagePayload payload, WebSocketSession session) {
        try {
            Long archiveItemId = ChatUtil.extractArchiveIdFromContent(payload.getContent());
            ArchiveItem archiveItem = archiveItemRepository.findById(archiveItemId)
                    .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ARCHIVE));

            // TODO: 여기서 archiveItem을 이용해 preview 메시지 content 구성 예정
            log.info("자료 미리보기 요청됨: archiveId = {}, file = {}", archiveItemId, archiveItem.getOriginalFilename());

            // 임시 응답: 추후 DTO로 가공 예정
            String previewText = "[자료] " + archiveItem.getOriginalFilename();
            ChatMessagePayload previewPayload = ChatMessagePayload.builder()
                    .roomId(payload.getRoomId())
                    .senderId(payload.getSenderId())
                    .format(MessageFormat.ARCHIVE)
                    .content(previewText)
                    .build();

            groupChatMessageService.saveAndBroadcast(previewPayload); // broadcast 처리

        } catch (Exception e) {
            log.error("format=ARCHIVE 메시지 처리 중 오류", e);
        }
    }


}