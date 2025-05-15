package com.example.mingle.domain.reservation.reservation.repository;

import com.example.mingle.domain.reservation.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

}
