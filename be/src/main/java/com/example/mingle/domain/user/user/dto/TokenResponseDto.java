package com.example.mingle.domain.user.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 로그인 성공 시 JWT 토큰을 응답에 담는다.
@Getter
@AllArgsConstructor
public class TokenResponseDto {
    private String accessToken;
    private String refreshToken;
}
