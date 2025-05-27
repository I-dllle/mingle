package com.example.mingle.domain.user.presence.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PresenceStatusDto {
    private Long userId;
    private String status;
    private String displayName;
    private String color;
}
