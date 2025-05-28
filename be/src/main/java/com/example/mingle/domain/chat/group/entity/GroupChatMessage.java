package com.example.mingle.domain.chat.group.entity;

import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor // JPA
@Getter
@Entity
public class GroupChatMessage extends BaseEntity {

    private Long chatRoomId;

    private Long senderId;

    @Enumerated(EnumType.STRING)
    private MessageFormat format;

    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
