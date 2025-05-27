package com.example.mingle.domain.attendance.attendance.dto.response;

import com.example.mingle.domain.attendance.attendance.dto.AttendanceRecordDto;
import lombok.*;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AttendancePageResponseDto {
    private List<AttendanceRecordDto> content;
    private int pageNumber;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}

