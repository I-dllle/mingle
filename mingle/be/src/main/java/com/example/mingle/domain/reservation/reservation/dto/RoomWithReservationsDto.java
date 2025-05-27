package com.example.mingle.domain.reservation.reservation.dto;

import com.example.mingle.domain.reservation.room.entity.RoomType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomWithReservationsDto {
    private Long roomId;
    private String roomName;
    private RoomType roomType;
    private List<ReservationResponseDto> reservations;
}
