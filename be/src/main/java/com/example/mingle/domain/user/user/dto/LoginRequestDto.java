package com.example.mingle.domain.user.user.dto;

import lombok.Getter;

// 사용자가 로그인 시 입력한 아이디/비밀번호를 받는다.
@Getter
public class LoginRequestDto {
    private String loginId;
    private String password;
}
