package com.example.mingle.domain.attendance.attendance.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkHoursChartResponseDto {
    private LocalDate date;
    private Double workingHours;
}
