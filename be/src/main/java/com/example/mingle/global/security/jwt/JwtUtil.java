package com.example.mingle.global.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Slf4j
@Component // 채팅(WebSocket) 등에서 DI로 사용 가능하게 추가
public class JwtUtil {

    // DI로 주입받은 secret
    // WebSocket 등에서 secret 주입 받기 위해 추가된 필드
    @Value("${custom.jwt.secretKey}")
    private String rawSecret;

    // Bean 초기화 후 SecretKey 캐싱
    private SecretKey secretKey; // 내부 캐싱용

    // Bean 생성 이후 자동 초기화: 기존 static 방식엔 없던 부분
    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(rawSecret.getBytes());
    }

    // static → 인스턴스 메서드로 전환
    public String generateToken(long expireSeconds, Map<String, Object> claims) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000L * expireSeconds);

        return Jwts.builder()
                .claims(claims)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    // static 제거, 내부 secretKey 사용
    public boolean isValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parse(token);
            return true;
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    // Payload 추출 (로그인 필터 등에서 사용)
    @SuppressWarnings("unchecked")
    public Map<String, Object> getPayload(String token) {
        try {
            return (Map<String, Object>) Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parse(token)
                    .getPayload();
        } catch (Exception e) {
            log.warn("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }

//    // [new] 채팅 등에서 DI로 주입해서 secret 없이 사용
//    public boolean isValid(String token) {
//        try {
//            Jwts.parser().verifyWith(secretKey).build().parse(token);
//            return true;
//        } catch (Exception e) {
//            log.warn("Invalid JWT token: {}", e.getMessage());
//            return false;
//        }
//    }
//
//    // [new] 채팅 등에서 DI로 주입해서 secret 없이 사용
//    @SuppressWarnings("unchecked")
//    public Map<String, Object> getPayload(String token) {
//        try {
//            return (Map<String, Object>) Jwts.parser().verifyWith(secretKey).build().parse(token).getPayload();
//        } catch (Exception e) {
//            log.warn("Failed to parse JWT token: {}", e.getMessage());
//            return null;
//        }
//    }
}
