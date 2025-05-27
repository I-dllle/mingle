package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.user.user.dto.UserSimpleDto;
import com.example.mingle.domain.user.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSearchDto {
    private Long id;
    private String name;
    private String email;

    public static UserSearchDto from(User user) {
        return new UserSearchDto(
                user.getId(),
                user.getName(),
                user.getEmail()
        );
    }
}
