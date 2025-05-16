package com.example.mingle.domain.reservation.room.dto;

import com.example.mingle.domain.reservation.reservation.dto.ReservationResponseDto;
import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import com.example.mingle.domain.reservation.room.entity.Room;
import com.example.mingle.domain.reservation.room.entity.RoomType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDto {
    private Long id;
    private String name;
    private RoomType type;
    private List<ReservationResponseDto> reservations;
}
