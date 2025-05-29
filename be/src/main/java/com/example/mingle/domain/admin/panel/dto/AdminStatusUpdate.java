package com.example.mingle.domain.admin.panel.dto;

import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.entity.UserStatus;

public record AdminStatusUpdate(UserStatus status) {}