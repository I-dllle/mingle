package com.example.mingle.domain.reservation.room.repository;

import com.example.mingle.domain.reservation.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {

}
