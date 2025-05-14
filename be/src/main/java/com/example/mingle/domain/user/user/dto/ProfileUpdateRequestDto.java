package com.example.mingle.domain.user.user.dto;

import lombok.Getter;

@Getter
public class ProfileUpdateRequestDto {
    private String nickname;
    private String email;
    private String position; // 직책
    private String phoneNum;
    private String imageUrl;
}
