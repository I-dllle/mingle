package com.example.mingle.domain.chat.group.entity;

import com.example.mingle.domain.chat.common.enums.ChatScope;
import com.example.mingle.domain.chat.common.enums.RoomType;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@SuperBuilder
@Entity
public class GroupChatRoom extends BaseEntity {

    /**
     * 채팅방의 소속 대상 ID
     * scope가 DEPARTMENT면 departmentId, PROJECT면 projectId로 사용됨
     */
    private Long teamId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RoomType roomType;      // 채팅방인지 자료방인지

    @Enumerated(EnumType.STRING)
    private ChatScope scope;        // 부서용인지 프로젝트용인지

    private String name;        // 채팅방 이름 (사용자에게 보이는 이름, 중복무관)

    private Long createdBy;

    private LocalDate projectEndDate; // 프로젝트 종료일 (null 가능, 부서 채팅방은 사용 안 함)

}