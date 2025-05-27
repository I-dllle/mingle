package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.entity.UserStatus;

public record AdminRequestUser(
        Long id,
        String loginId,
        String name,
        String nickname,
        String email,
        String phoneNum,
        String imageUrl,
        String departmentName,
        String Name,
        UserRole role,
        UserStatus status

) {
    public static AdminRequestUser from(User user) {
        return new AdminRequestUser(
                user.getId(),
                user.getLoginId(),
                user.getName(),
                user.getNickname(),
                user.getEmail(),
                user.getPhoneNum(),
                user.getImageUrl(),
                user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null,
                user.getPosition() != null ? user.getPosition().getName() : null,
                user.getRole(),
                user.getStatus()
        );
    }
}