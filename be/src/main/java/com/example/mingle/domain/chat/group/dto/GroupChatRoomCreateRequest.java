package com.example.mingle.domain.chat.group.dto;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record GroupChatRoomCreateRequest(

        @NotNull(message = "teamId는 필수입니다.")
        Long teamId,            // 통합 ID: 부서 또는 프로젝트 ID

        @NotNull(message = "roomType은 필수입니다.")
        RoomType roomType,

        @NotNull(message = "scope는 필수입니다.")
        ChatScope scope,

        @NotBlank(message = "채팅방 이름은 필수입니다.")
        String name,             // 사용자 지정 채팅방 이름(projectName 필드)

        LocalDate projectEndDate // 프로젝트 종료일 (선택 입력)

) {}
