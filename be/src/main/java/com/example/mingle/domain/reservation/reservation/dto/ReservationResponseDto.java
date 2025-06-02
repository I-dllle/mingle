package com.example.mingle.domain.reservation.reservation.dto;

import com.example.mingle.domain.reservation.reservation.entity.ReservationStatus;
import com.example.mingle.domain.reservation.room.entity.RoomType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponseDto {
    private Long id;

    private Long roomId;

    private String roomName;

    private RoomType roomType;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    private ReservationStatus reservationStatus;

    private String title;

    private Long userId;

    private String userName;

    private String nickName;
}
