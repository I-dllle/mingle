package com.example.mingle.domain.reservation.room.controller;

import com.example.mingle.domain.reservation.room.dto.RoomDto;
import com.example.mingle.domain.reservation.room.service.RoomService;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.rq.Rq;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/room")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "방 관리 API - 관리자 전용")
public class RoomController {

    private final RoomService roomService;
    private final Rq rq;

    //생성
    @Operation(summary = "방 생성", description = "새로운 방을 생성합니다.")
    @PostMapping
    public ResponseEntity<RoomDto> create(@RequestBody RoomDto dto) {
        // 관리자 권한 확인
        User user = rq.getActor();
        if (user == null || user.getRole() != UserRole.ADMIN) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        RoomDto createdRoom = roomService.createRoom(dto);
        return ResponseEntity.status(201).body(createdRoom);
    }

    // 전체 방 조회
    @Operation(summary = "전체 방 조회", description = "모든 방을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<RoomDto>> getRoomList() {
        // 관리자 권한 확인
        User user = rq.getActor();
        if (user == null || user.getRole() != UserRole.ADMIN) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // 개별 방 조회
    // 딱히 쓸 일 없을듯...
    @Operation(summary = "개별 방 조회", description = "ID로 특정 방의 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoom(@PathVariable Long id) {
        // 관리자 권한 확인
        User user = rq.getActor();
        if (user == null || user.getRole() != UserRole.ADMIN) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    // 수정
    @PutMapping("/{id}")
    @Operation(summary = "방 수정", description = "방 이름과 타입을 수정합니다.")
    public ResponseEntity<RoomDto> updateRoom(
            @PathVariable Long id,
            @RequestBody RoomDto dto
    ) {
        // 관리자 권한 확인
        User user = rq.getActor();
        if (user == null || user.getRole() != UserRole.ADMIN) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        return ResponseEntity.ok(roomService.updateRoom(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "방 삭제", description = "특정 방을 삭제합니다.")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        // 관리자 권한 확인
        User user = rq.getActor();
        if (user == null || user.getRole() != UserRole.ADMIN) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}

