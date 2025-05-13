package com.example.mingle.domain.user.user.service;

import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.global.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthTokenService {
    /**
     * yaml 파일에서 정보 @Value로 받아옴
     */
    @Value("${custom.jwt.secretKey}")
    private String jwtSecret;

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
        return JwtUtil.generateToken(
                jwtSecret,
                accessTokenExpirationSeconds,
                Map.of("id", id, "email", email, "nickname", nickname, "role", role)
        );
    }

    /**
     * 리프레시 토큰 생성
     */
    public String genRefreshToken(User user) {
        long id = user.getId();
        String email = user.getEmail();

        return JwtUtil.generateToken(
                jwtSecret,
                refreshTokenExpirationSeconds,
                Map.of("id", id, "email", email)
        );
    }

    public String genRefreshTokenByEmail(String email) {

        return JwtUtil.generateToken(
                jwtSecret,
                refreshTokenExpirationSeconds,
                Map.of("email", email)
        );
    }

    /**
     * 토큰 페이로드 추출
     */
    public Map<String, Object> payload(String token) {
        return JwtUtil.getPayload(jwtSecret, token);
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean isValid(String token) {
        return JwtUtil.isValid(jwtSecret, token);
    }
}