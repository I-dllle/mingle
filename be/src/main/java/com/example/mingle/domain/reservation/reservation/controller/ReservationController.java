package com.example.mingle.domain.reservation.reservation.controller;

import com.example.mingle.domain.reservation.reservation.service.ReservationService;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.rq.Rq;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping("/api/rooms/{roomId}/reservations")
    public ReservationResponse create(
            @PathVariable Long roomId,
            @RequestBody CreateReservationRequest req) {
        Long id = rq.getActor().getId();

        return reservationService.reserve(user.getId(), roomId, req);
    }

    @GetMapping("/api/users/{userId}/reservations")
    public Page<ReservationResponse> listMy(
            @PathVariable Long userId,
            @RequestParam(defaultValue="1") int page,
            @RequestParam(defaultValue="10") int size) {
        return reservationService.listByUser(userId, page-1, size);
    }

    @GetMapping("/api/reservations/{reservationId}")
    public ReservationResponse getOne(@PathVariable Long reservationId) {
        return reservationService.get(reservationId);
    }

    @PutMapping("/api/reservations/{reservationId}")
    public ReservationResponse update(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal JwtUser user,
            @RequestBody UpdateReservationRequest req) {
        return reservationService.update(user.getId(), reservationId, req);
    }

    @DeleteMapping("/api/reservations/{reservationId}")
    public ResponseEntity<Void> cancel(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal JwtUser user) {
        reservationService.cancel(user.getId(), reservationId);
        return ResponseEntity.noContent().build();
    }
}
