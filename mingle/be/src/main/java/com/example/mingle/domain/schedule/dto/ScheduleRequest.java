package com.example.mingle.domain.schedule.dto;

import com.example.mingle.domain.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.schedule.entity.ScheduleType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "일정 생성/수정 요청 DTO")
public class ScheduleRequest {

    private Long postId;

    @NotBlank
    @Schema(description = "일정 제목", example = "회의")
    private String title;

    @Schema(description = "일정 상세 설명", example = "프로젝트 킥오프 미팅")
    private String description;

    @Schema(description = "시작 시간 (ISO datetime)", example = "2025-05-13T10:00:00")
    private LocalDateTime startTime;

    @Schema(description = "종료 시간 (ISO datetime)", example = "2025-05-13T11:00:00")
    private LocalDateTime endTime;

    @Schema(description = "메모", example = "오늘은 심히 배고픈데 점심으로 뭘 먹을지 심각하게 고민해야된다! 점심이야말로 내가 회사를 다니는 이유! 그것이 가장 큰 문제이다")
    private String memo;

    @NotNull
    @Schema(description = "일정 타입", example = "PERSONAL")
    private ScheduleType scheduleType;  // PERSONAL, TEAM, COMPANY

    @Schema(description = "일정 상태", example = "휴가")
    private ScheduleStatus scheduleStatus; // 중요회의, 출장, 일정완료, 일정취소, 휴가

    @Schema(description = "부서 ID", example = "1")
    private Long departmentId;
}

