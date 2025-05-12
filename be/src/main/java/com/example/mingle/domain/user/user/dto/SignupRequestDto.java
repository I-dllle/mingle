package com.example.mingle.domain.user.user.dto;

import lombok.Getter;

@Getter
public class SignupRequestDto {
    private String loginId;
    private String password;
    private String nickname;
    private String email;
    private String phoneNum;
    private String imageUrl;
    private String role;        // ARTIST, STAFF 등
    private Long departmentId;  // 부서 ID
}
