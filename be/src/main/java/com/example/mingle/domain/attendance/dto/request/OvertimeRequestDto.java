package com.example.mingle.domain.attendance.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OvertimeRequestDto {
    private Long attendanceId;
    private String reason;
}
