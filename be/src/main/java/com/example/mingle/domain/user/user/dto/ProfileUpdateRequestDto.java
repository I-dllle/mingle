package com.example.mingle.domain.user.user.dto;

import lombok.Getter;

@Getter
public class ProfileUpdateRequestDto {
    private String nickname;
    private String email;
    private Long positionId; // 직책: UserPosition 엔티티 ID 참조용
    private String phoneNum;
    private String imageUrl;
}
