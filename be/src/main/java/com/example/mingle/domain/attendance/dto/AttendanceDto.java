package com.example.mingle.domain.attendance.dto;

import com.example.mingle.domain.attendance.enums.AttendanceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDto {

    @Schema(description = "근태 ID", example = "1")
    private Long id;

    @Schema(description = "근무 일자", example = "2025-05-13")
    private LocalDate date;

    @Schema(description = "출근 시각", example = "2025-05-13T09:00:00")
    private LocalDateTime checkInTime;

    @Schema(description = "퇴근 시각", example = "2025-05-13T18:00:00")
    private LocalDateTime checkOutTime;

    @Schema(description = "기본 근무시간 (시간 단위)", example = "8.00")
    private Double workingHours;

    @Schema(description = "연장근무 시작 시각", example = "2025-05-13T18:00:00")
    private LocalDateTime overtimeStart;

    @Schema(description = "연장근무 종료 시각", example = "2025-05-13T20:00:00")
    private LocalDateTime overtimeEnd;

    @Schema(description = "연장근무시간 (시간 단위)", example = "2.00")
    private Double overtimeHours;

    @Schema(description = "근태 상태", example = "정상")
    private AttendanceStatus attendanceStatus;
}

