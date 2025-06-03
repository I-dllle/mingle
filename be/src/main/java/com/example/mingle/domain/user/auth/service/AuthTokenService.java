package com.example.mingle.domain.user.auth.service;

import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.global.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor // jwtUtil 주입을 위해 사용
public class AuthTokenService {

    // JwtUtil 인스턴스 주입 (DI 방식)
    private final JwtUtil jwtUtil;

    @Value("${custom.accessToken.expirationSeconds}")
    private long accessTokenExpirationSeconds;

    @Value("${custom.refreshToken.expirationSeconds}")
    private long refreshTokenExpirationSeconds;

    /**
     * 액세스 토큰 생성
     */
    public String genAccessToken(User user) {
        long id = user.getId();
        String email = user.getEmail();
        String nickname = user.getNickname();
        UserRole role = user.getRole();

        return jwtUtil.generateToken(
                accessTokenExpirationSeconds,
                Map.of("userId", id, "email", email, "nickname", nickname, "role", role)
        );
    }

    /**
     * 리프레시 토큰 생성
     */
    public String genRefreshToken(User user) {
        long id = user.getId();
        String email = user.getEmail();

        return jwtUtil.generateToken(
                refreshTokenExpirationSeconds,
                Map.of("userId", id, "email", email)
        );
    }

    public String genRefreshTokenByEmail(String email) {

        return jwtUtil.generateToken(
                refreshTokenExpirationSeconds,
                Map.of("email", email)
        );
    }

    /**
     * 토큰 페이로드 추출
     */
    public Map<String, Object> payload(String token) {
        return jwtUtil.getPayload(token);
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean isValid(String token) {
        return jwtUtil.isValid(token);
    }
}