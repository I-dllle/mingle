// 선택이나 리스트, 검색 등 간단한 표시용
package com.example.mingle.domain.user.user.dto;

import com.example.mingle.domain.user.user.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSimpleDto {
    private Long id;
    private String nickname;
    private String email;

    public static UserSimpleDto from(User user) {
        return UserSimpleDto.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .build();
    }
}