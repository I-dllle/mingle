package com.example.mingle.domain.reservation.room.entity;

import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class Room {
    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    private String name;

    @Enumerated(EnumType.STRING)
    private RoomType type;
}
