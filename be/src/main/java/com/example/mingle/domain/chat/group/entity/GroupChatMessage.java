package com.example.mingle.domain.chat.group.entity;

import com.example.mingle.domain.chat.common.enums.MessageType;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;

@Entity
public class GroupChatMessage extends BaseEntity {

    @Id
    @GeneratedValue
    private Long id;

    private Long chatRoomId;

    private Long senderId;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    private String content;
}
