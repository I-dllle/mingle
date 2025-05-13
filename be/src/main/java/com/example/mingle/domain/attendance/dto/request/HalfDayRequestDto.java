package com.example.mingle.domain.attendance.dto.request;

import com.example.mingle.domain.attendance.enums.HalfDayType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HalfDayRequestDto {
    private LocalDate date;
    private HalfDayType halfDayType;
    private String reason;
}
