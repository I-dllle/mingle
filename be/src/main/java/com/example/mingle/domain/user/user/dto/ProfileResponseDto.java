package com.example.mingle.domain.user.user.dto;

import com.example.mingle.domain.user.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProfileResponseDto {
    private String nickname;
    private String email;
    private String position; // 직책
    private String phoneNum;
    private String imageUrl;

    public static ProfileResponseDto fromEntity(User user) {
        return ProfileResponseDto.builder()
                .nickname(user.getNickname())
                .email(user.getEmail())
                .position(user.getPosition().getName()) // 직책
                .phoneNum(user.getPhoneNum())
                .imageUrl(user.getImageUrl())
                .build();
    }
}
