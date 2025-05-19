package com.example.mingle.domain.chat.common.socket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;


@Component
@Slf4j
public class ChatWebSocketHandler extends TextWebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket 연결됨: sessionId = {}", session.getId());
        // TODO: 인증 처리 예정 (WebSocketAuthDto, SessionManager 연동)
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        log.info("메시지 수신: sessionId = {}, payload = {}", session.getId(), message.getPayload());
        // TODO: 메시지 파싱 및 저장 예정 (ChatMessagePayload 처리)
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket 연결 종료: sessionId = {}", session.getId());
        // TODO: 세션 정리 예정 (SessionManager)
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.warn("WebSocket 에러: sessionId = {}, error = {}", session.getId(), exception.getMessage());
    }
}