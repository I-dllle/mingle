package com.example.mingle.domain.user.user.dto;

import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.entity.UserStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {

    private Long id;
    private String loginId;
    private String nickname;
    private String email;
    private String phoneNum;
    private String imageUrl;
    private UserRole role;
    private UserStatus status;

    public static UserResponseDto fromEntity(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .loginId(user.getLoginId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .phoneNum(user.getPhoneNum())
                .imageUrl(user.getImageUrl())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }
}
