package com.example.mingle.domain.attendance.attendanceRequest.dto;

import com.example.mingle.domain.attendance.enums.LeaveType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRequestDto {
    private Long userId;

    @NotNull(message = "휴가 유형을 선택해야 합니다.")
    private LeaveType type;

    @NotNull(message = "시작일을 입력해야 합니다.")
    @FutureOrPresent(message = "시작일은 오늘 또는 미래 날짜여야 합니다.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @FutureOrPresent(message = "종료일은 오늘 또는 미래 날짜여야 합니다.")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "조퇴 시 시작 시간을 입력해야 합니다.")
    private LocalTime startTime;
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;

    @NotBlank
    @Size(min = 1, max = 500, message = "신청 사유를 입력해야 합니다. (500자 이내)")
    private String reason;
}
