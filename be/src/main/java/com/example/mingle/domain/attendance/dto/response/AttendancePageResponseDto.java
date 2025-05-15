package com.example.mingle.domain.attendance.dto.response;

import com.example.mingle.domain.attendance.dto.AttendanceRecordDto;
import lombok.*;

import java.util.List;

@Getter
@Setter
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

