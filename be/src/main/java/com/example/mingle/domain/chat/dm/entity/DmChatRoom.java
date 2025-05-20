package com.example.mingle.domain.chat.dm.entity;

import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class DmChatRoom extends BaseEntity {

    // DM 채팅방에 참여하는 두 유저의 ID
    // 참여자 A
    @Column(nullable = false)
    private Long userAId;

    // 참여자 B
    @Column(nullable = false)
    private Long userBId;



    @Column(nullable = false, unique = true)
    private String roomKey; // userAId_userBId 식의 고유 식별자 (sort해서 저장)


    /**
     * 두 사용자 간 DM 채팅방 식별을 위해, userAId < userBId 순서로 저장할 것
     */
}