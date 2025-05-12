package com.example.mingle.domain.admin.dto;

import lombok.Getter;

@Getter
public class UpdateUserRoleRequestDto {
    private String role; // "USER", "STAFF", "ADMIN"
}
