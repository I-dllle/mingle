package com.example.mingle.domain.reservation.reservation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReservationStatus {
    CONFIRMED("예약 확정"),
    CANCELED("예약 취소");

    private final String displayName;

}
