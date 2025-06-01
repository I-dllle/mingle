// 전체 정보 반환
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
    private Long departmentId;
    private String departmentName;

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
                .departmentId(
                        user.getDepartment() != null ? user.getDepartment().getId() : null
                )
                .departmentName(
                        user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null
                )
                .build();
    }
}
