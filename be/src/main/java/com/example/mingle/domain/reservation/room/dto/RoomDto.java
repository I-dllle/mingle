package com.example.mingle.domain.reservation.room.dto;

import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import com.example.mingle.domain.reservation.room.entity.Room;
import com.example.mingle.domain.reservation.room.entity.RoomType;

public class RoomDto {
    private Long id;
    private String name;
    private RoomType type;
    private Long reservationId;
}
