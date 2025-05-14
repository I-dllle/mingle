package com.example.mingle.domain.attendance.dto.request;

import com.example.mingle.domain.attendance.enums.VacationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VacationRequestDto {
    private List<LocalDate> vacationDateList;
    private VacationType vacationType;
    private String reason;

}
