package com.example.mingle.domain.chat.common.socket;

import com.example.mingle.domain.chat.common.dto.ChatMessagePayload;
import com.example.mingle.domain.chat.group.service.GroupChatMessageService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
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

    // 유효성 검사를 위한 Validator
    private final Validator validator;



    /**
     * 클라이언트가 WebSocket에 처음 연결됐을 때 실행
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket 연결됨: sessionId = {}", session.getId());
        // TODO: 인증 처리 예정 (WebSocketAuthDto, SessionManager 연동)
    }



    /**
     * 클라이언트가 메시지를 전송했을 때 실행
     */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        log.info("메시지 수신: sessionId = {}, payload = {}", session.getId(), message.getPayload());

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
            groupChatMessageService.saveAndBroadcast(payload);

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
}