package com.example.mingle.global.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Slf4j
public class JwtUtil {

    // JWT 생성
    public static String generateToken(String secret, long expireSeconds, Map<String, Object> claims) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + 1000L * expireSeconds);

        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.builder()
                .claims(claims)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    // 유효성 검사
    public static boolean isValid(String secret, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parse(token);
            return true;
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    // Payload 추출
    @SuppressWarnings("unchecked")
    public static Map<String, Object> getPayload(String secret, String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
            return (Map<String, Object>) Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parse(token)
                    .getPayload();
        } catch (Exception e) {
            log.warn("Failed to parse JWT token: {}", e.getMessage());
            return null;
        }
    }
}
