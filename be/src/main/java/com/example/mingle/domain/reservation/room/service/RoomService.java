package com.example.mingle.domain.reservation.room.service;

import com.example.mingle.domain.reservation.room.dto.RoomDto;
import com.example.mingle.domain.reservation.room.entity.Room;
import com.example.mingle.domain.reservation.room.repository.RoomRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    // 방 생성
    @Transactional
    public RoomDto createRoom(RoomDto dto) {
        Room room = Room.builder()
                .name(dto.getName())
                .type(dto.getType())
                .build();
        Room saved = roomRepository.save(room);

        return RoomDto.builder()
                .id(saved.getId())
                .type(saved.getType())
                .name(saved.getName())
                .build();
    }

    // 개별 방 조회
    @Transactional(readOnly = true)
    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));

        return RoomDto.builder()
                .id(room.getId())
                .type(room.getType())
                .name(room.getName())
                .build();
    }

    // 모든 방 조회
    @Transactional(readOnly = true)
    public List<RoomDto> getAllRooms() {

        List<Room> rooms = roomRepository.findAll();

        List<RoomDto> roomDtos = new ArrayList<>();

        for (Room room : rooms) {
            roomDtos.add(RoomDto.builder()
                    .id(room.getId())
                    .type(room.getType())
                    .name(room.getName())
                    .build());
        }
        return roomDtos;
    }


    // 방 수정
    @Transactional
    public RoomDto updateRoom(Long id, RoomDto dto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));
        room.setName(dto.getName());
        room.setType(dto.getType());
        Room updated = roomRepository.save(room);
        return RoomDto.builder()
                .id(updated.getId())
                .type(updated.getType())
                .name(updated.getName())
                .build();
    }

    // 방 삭제
    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ApiException(ErrorCode.ROOM_NOT_FOUND));
        roomRepository.delete(room);
    }
}

