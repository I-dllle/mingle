package com.example.mingle.global.websocket;

import com.example.mingle.domain.chat.common.dto.WebSocketAuthDto;
import org.springframework.web.socket.WebSocketSession;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class WebSocketSessionManager {

    // 세션 ID 기준 → 인증 정보
    private final Map<String, WebSocketAuthDto> sessionMap = new ConcurrentHashMap<>();

    // 유저 ID 기준 → WebSocketSession (DM 등 직접 송신용)
    private final Map<Long, WebSocketSession> userSessionMap = new ConcurrentHashMap<>();

    /**
     * WebSocket 연결 시: 인증 정보 + 세션 바인딩
     */
    public void register(String sessionId, WebSocketAuthDto authDto, WebSocketSession session) {
        sessionMap.put(sessionId, authDto);
        userSessionMap.put(authDto.getUserId(), session);
        log.info("WebSocket 등록: sessionId={}, userId={}", sessionId, authDto.getUserId());
    }

    /**
     * 연결 종료 시: 인증 정보 + 세션 모두 제거
     */
    public void unregister(String sessionId) {
        WebSocketAuthDto removed = sessionMap.remove(sessionId);
        if (removed != null) {
            userSessionMap.remove(removed.getUserId());
            log.info("🗑 WebSocket 해제: sessionId={}, userId={}", sessionId, removed.getUserId());
        }
    }

    /**
     * 세션 ID로 인증 정보 조회
     */
    public WebSocketAuthDto get(String sessionId) {
        return sessionMap.get(sessionId);
    }

    /**
     * 유저 ID로 현재 연결 여부 확인
     */
    public boolean isConnected(Long userId) {
        return userSessionMap.containsKey(userId);
    }

    /**
     * 유저 ID로 WebSocketSession 조회 (DM 전송용)
     */
    public WebSocketSession getSessionByUserId(Long userId) {
        return userSessionMap.get(userId);
    }

    /**
     * 현재 모든 인증 세션 정보 반환 (디버깅용)
     */
    public Map<String, WebSocketAuthDto> getAllAuthSessions() {
        return sessionMap;
    }

    /**
     * 현재 모든 유저 세션 정보 반환 (디버깅용)
     */
    public Map<Long, WebSocketSession> getAllUserSessions() {
        return userSessionMap;
    }
}