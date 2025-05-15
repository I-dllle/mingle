package com.example.mingle.domain.reservation.room.controller;

import com.example.mingle.domain.reservation.room.dto.RoomDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {
    @GetMapping
    public List<RoomDto> listRooms() {
        return null;
    }

    @GetMapping("/{roomId}")
    public RoomDto getRoom(@PathVariable(name = "roomId") Long roomId) {
        return null;
    }
}
