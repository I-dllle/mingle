package com.example.mingle.domain.reservation.reservation.repository;

import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import com.example.mingle.domain.reservation.reservation.entity.ReservationStatus;
import org.springframework.data.repository.query.Param;
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

    // 자기가 에약 모든 에약 가져오기
    List<Reservation> findByUserId(Long userId);

    //날짜별 방 가져오기.
    List<Reservation> findAllByRoomIdAndDateAndReservationStatusOrderByStartTime(Long roomId, LocalDate date, ReservationStatus status);

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

    // 날짜 사이 모든 예약 조회
    // 변경: CANCELED 상태가 아닌 것만 조회
    List<Reservation> findAllByDateBetweenAndReservationStatusNot(
            LocalDate start,
            LocalDate end,
            ReservationStatus status
    );
}
