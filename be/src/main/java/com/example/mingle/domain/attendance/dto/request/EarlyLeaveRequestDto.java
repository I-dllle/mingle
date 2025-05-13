package com.example.mingle.domain.attendance.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EarlyLeaveRequestDto {
    private Long attendanceId;
    private LocalDateTime earlyLeaveTime;
    private String reason;
}
