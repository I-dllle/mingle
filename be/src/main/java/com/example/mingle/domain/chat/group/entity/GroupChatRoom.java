package com.example.mingle.domain.chat.group.entity;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;

@Entity
public class GroupChatRoom extends BaseEntity {

    @Id
    @GeneratedValue
    private Long id;

    private Long teamId;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    @Enumerated(EnumType.STRING)
    private ChatScope scope;

    private String name;

    private Long createdBy;
}