package com.example.mingle.domain.chat.dm.entity;

import com.example.mingle.domain.chat.common.enums.MessageFormat;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class DmChatMessage extends BaseEntity {

    private Long dmRoomId;      // DM 채팅방 ID

    private Long senderId;      // 보낸 사람

    private Long receiverId;

    @Enumerated(EnumType.STRING)
    private MessageFormat format;        // 메시지 타입

    private String content;     // 본문

    // 추후 구현: 읽음 처리 기능을 위한 필드
    private boolean isRead; // TODO
    private LocalDateTime readAt; // TODO

    public void updateContent(String newContent) {
        this.content = newContent;
    }

}
