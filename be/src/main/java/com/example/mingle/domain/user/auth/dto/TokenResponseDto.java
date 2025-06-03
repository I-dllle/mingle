package com.example.mingle.domain.user.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

// 로그인 성공 시 JWT 토큰을 응답에 담는다.
@Getter
@Builder
@AllArgsConstructor
public class TokenResponseDto {
    private String accessToken;
    private String refreshToken;

    private Long userId;
    private String nickname;
    private String email;
}
