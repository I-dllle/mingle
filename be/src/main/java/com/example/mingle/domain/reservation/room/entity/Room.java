package com.example.mingle.domain.reservation.room.entity;

import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Room extends BaseEntity {

    @Builder.Default
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservationList = new ArrayList<>();

    private String name;

    @Enumerated(EnumType.STRING)
    private RoomType type;
}
