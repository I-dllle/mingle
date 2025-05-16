package com.example.mingle.domain.reservation.reservation.entity;

import com.example.mingle.domain.reservation.room.entity.Room;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Getter@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Reservation extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable=false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "reservation_status", nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private ReservationStatus reservationStatus;

    @Column(length = 100)
    private String title;

}
