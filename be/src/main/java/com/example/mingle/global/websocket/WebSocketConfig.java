package com.example.mingle.global.websocket;

import com.example.mingle.domain.chat.common.socket.ChatWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;
    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        // /ws/chat 경로로 WebSocket 연결 허용
        registry.addHandler(chatWebSocketHandler, "/ws/chat/{roomId}")
                .addInterceptors(jwtHandshakeInterceptor)
                .setAllowedOrigins("*")
                .withSockJS();
    }
}
