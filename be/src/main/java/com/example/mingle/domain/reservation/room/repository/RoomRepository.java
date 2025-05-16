package com.example.mingle.domain.reservation.room.repository;

import com.example.mingle.domain.reservation.room.entity.Room;
import com.example.mingle.domain.reservation.room.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findAllByType(RoomType type);
}
