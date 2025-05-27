package com.example.mingle.domain.admin.panel.dto;

public record AdminUpdateUser(
        String name,
        String phoneNum,
        Long departmentId,
        Long positionId
) {}