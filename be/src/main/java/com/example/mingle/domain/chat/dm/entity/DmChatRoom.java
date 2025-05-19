package com.example.mingle.domain.chat.dm.entity;

import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class DmChatRoom extends BaseEntity {

    @Id
    @GeneratedValue
    private Long id;

    private Long userAId;

    private Long userBId;
}