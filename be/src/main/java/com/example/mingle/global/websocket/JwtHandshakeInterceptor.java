package com.example.mingle.global.websocket;

import com.example.mingle.domain.chat.common.dto.WebSocketAuthDto;
import com.example.mingle.global.security.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            String token = httpRequest.getParameter("token");

            if (token != null && jwtUtil.isValid(token)) {
                Map<String, Object> payload = jwtUtil.getPayload(token);
                if (payload == null) return false;

                Long userId = ((Number) payload.get("userId")).longValue();
                String email = (String) payload.get("email");

                attributes.put("auth", new WebSocketAuthDto(userId, email));
                log.info("WebSocket 인증 성공 - userId={}, email={}", userId, email);
                return true;
            }

            log.warn("WebSocket 인증 실패 - 토큰 없음 or 검증 실패");
        }

        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // 생략 가능
    }
}
