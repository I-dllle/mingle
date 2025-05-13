package com.example.mingle.domain.attendance.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceSearchRequestDto {
    private LocalDate startDate;
    private LocalDate endDate;
}
