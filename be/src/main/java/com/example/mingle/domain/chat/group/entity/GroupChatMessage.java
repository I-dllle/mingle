package com.example.mingle.domain.chat.group.entity;

import com.example.mingle.domain.chat.common.enums.MessageType;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor // JPA
@Getter
@Entity
public class GroupChatMessage extends BaseEntity {

    private Long chatRoomId;

    private Long senderId;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    private String content;
}
