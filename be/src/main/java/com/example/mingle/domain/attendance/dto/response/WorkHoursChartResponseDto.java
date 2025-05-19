package com.example.mingle.domain.attendance.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkHoursChartResponseDto {
    private LocalDate date;
    private Double workingHours;
}
