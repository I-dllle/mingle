package com.example.mingle.domain.reservation.reservation.controller;

import com.example.mingle.domain.reservation.reservation.dto.ReservationRequestDto;
import com.example.mingle.domain.reservation.reservation.dto.ReservationResponseDto;
import com.example.mingle.domain.reservation.reservation.dto.RoomWithReservationsDto;
import com.example.mingle.domain.reservation.reservation.service.ReservationService;
import com.example.mingle.domain.reservation.room.entity.RoomType;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import com.example.mingle.global.rq.Rq;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservations", description = "예약 API")
public class ApiV1ReservationController {

    private final ReservationService reservationService;
    private final Rq rq;

    // 예약 생성
    @Operation(summary = "예약 생성", description = "로그인된 사용자가 새 예약을 생성합니다.")
    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(
            @RequestBody ReservationRequestDto dto
    ) {
        Long userId = rq.getActor().getId();
        ReservationResponseDto created = reservationService.createReservation(dto, userId);
        return ResponseEntity
                .status(201)
                .body(created);
    }

    // 방 타입별 특정 날짜 모든 방의 예약 확인
    @Operation(summary = "방 타입별 예약 조회", description = "특정 날짜 및 룸 타입에 속하는 모든 방의 예약 내역을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<RoomWithReservationsDto>> getRoomsWithReservations(
            @RequestParam("type") RoomType roomType,
            @RequestParam("date")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        List<RoomWithReservationsDto> list = reservationService.getRoomsWithReservations(roomType, date);
        return ResponseEntity.ok(list);
    }

    // 나의 예약 현황
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponseDto>> getMyReservations(
    ) {
        Long userId = rq.getActor().getId();
        List<ReservationResponseDto> myReservations = reservationService.getMyReservations(userId);
        return ResponseEntity.ok(myReservations);
    }

    // 예약 상세 조회
    @Operation(summary = "단일 예약 상세 조회", description = "예약 ID로 예약 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDto> getReservationById(@PathVariable("id") Long reservationId) {
        Long userId = rq.getActor().getId();
        ReservationResponseDto dto = reservationService.getReservationById(reservationId, userId);
        return ResponseEntity.ok(dto);
    }


    // 예약 수정
    @PutMapping("/{id}")
    @Operation(summary = "예약 수정", description = "날짜 또는 시간만 변경할 수 있습니다.")
    public ResponseEntity<ReservationResponseDto> updateReservation(
            @PathVariable(name = "id") Long reservationId,
            @RequestBody ReservationRequestDto dto
    ) {
        Long userId = rq.getActor().getId();
        ReservationResponseDto updated = reservationService.updateReservation(reservationId, dto, userId);
        return ResponseEntity.ok(updated);
    }

    //예약 삭제
    @Operation(summary = "예약 취소 (삭제)", description = "사용자가 본인의 예약을 취소합니다. 소프트 삭제로 상태만 변경됩니다.")
    @PatchMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(
            @PathVariable(name = "id") Long reservationId
    ) {
        Long userId = rq.getActor().getId();
        reservationService.deleteReservation(reservationId, userId);
        return ResponseEntity.noContent().build();
    }

    // =================== 관리자 전용 =========================

    // 관리자 전용 월간 예약 전체 조회
    @GetMapping("/admin")
    public ResponseEntity<List<ReservationResponseDto>> getAllReservations(
            @RequestParam("month") @DateTimeFormat(pattern = "yyyy-MM") YearMonth month
    ) {
        if (!UserRole.ADMIN.equals(rq.getActor().getRole())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        // 관리자 권한 확인
        List<ReservationResponseDto> list = reservationService.getAllReservationsByMonth(month);
        return ResponseEntity.ok(list);
    }

    // 관리자 전용 예약 수정
    @PutMapping("/admin/{id}")
    public ResponseEntity<ReservationResponseDto> adminUpdateReservation(
            @PathVariable(name = "id") Long reservationId,
            @RequestBody ReservationRequestDto dto
    ) {
        if (!UserRole.ADMIN.equals(rq.getActor().getRole())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        ReservationResponseDto updated = reservationService.adminUpdateReservation(reservationId, dto);
        return ResponseEntity.ok(updated);
    }

    // 예약 강제 취소
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> adminCancelReservation(@PathVariable(name = "id") Long reservationId) {
        if (!UserRole.ADMIN.equals(rq.getActor().getRole())) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }
        reservationService.adminCancelReservation(reservationId);
        return ResponseEntity.noContent().build();
    }
}