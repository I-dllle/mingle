package com.example.mingle.domain.reservation.reservation.service;

import com.example.mingle.domain.reservation.room.dto.RoomDto;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.rq.Rq;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class ReservationService {

    private final Rq rq;

    @GetMapping
    public List<RoomDto> listRooms() {
        return null;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<RoomDto> getRoom(@RequestBody RoomDto roomDto) {
        User user = rq.getActor();
        return null;
    }

}
