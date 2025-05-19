package com.example.mingle.domain.chat.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketAuthDto {
    private Long userId;
    private String email;
}
