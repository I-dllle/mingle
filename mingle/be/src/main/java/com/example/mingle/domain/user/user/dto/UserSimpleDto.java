package com.example.mingle.domain.user.user.dto;

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
}