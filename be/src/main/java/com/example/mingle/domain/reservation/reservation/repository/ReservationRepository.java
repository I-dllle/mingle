package com.example.mingle.domain.reservation.reservation.repository;

import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import com.example.mingle.domain.reservation.reservation.entity.ReservationStatus;
import com.example.mingle.domain.reservation.room.entity.RoomType;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 특정 룸, 특정 날짜에 겹치는 예약이 있는지 검사

    boolean existsByRoomIdAndDateAndStartTimeLessThanAndEndTimeGreaterThanAndReservationStatus(
            Long roomId,
            LocalDate date,
            LocalTime endTime,
            LocalTime startTime,
            ReservationStatus status
    );


    //날짜별 방 가져오기.
    List<Reservation> findAllByRoomIdAndDateOrderByStartTime(Long roomId, LocalDate date);

    //자기 자신의 예약인지 확인
    @Query("SELECT COUNT(r) > 0 FROM Reservation r " +
            "WHERE r.room.id = :roomId " +
            "AND r.date = :date " +
            "AND r.startTime < :newEnd " +
            "AND r.endTime > :newStart " +
            "AND r.id != :reservationId " +
            "AND r.reservationStatus = :status")
    boolean existsOverlappingReservationExceptThisWithStatus(
            @Param("roomId") Long roomId,
            @Param("date") LocalDate date,
            @Param("newStart") LocalTime newStart,
            @Param("newEnd") LocalTime newEnd,
            @Param("reservationId") Long reservationId,
            @Param("status") ReservationStatus status
    );
}
