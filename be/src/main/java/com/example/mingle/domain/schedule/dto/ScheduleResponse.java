package com.example.mingle.domain.schedule.dto;

import com.example.mingle.domain.schedule.entity.ScheduleStatus;
import com.example.mingle.domain.schedule.entity.ScheduleType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "일정 응답 DTO")
public class ScheduleResponse {
    @Schema(description = "일정 ID", example = "1") private Long id;
    @Schema(description = "유저 ID", example = "1") private Long userId;
    @Schema(description = "포스트 ID(없을 수 있음)", example = "1") private Long postId;
    @Schema(description = "일정 제목", example = "회의") private String title;
    @Schema(description = "일정 설명", example = "프로젝트 킥오프 미팅") private String description;
    @Schema(description = "시작 시간", example = "2025-05-13T10:00:00") private LocalDateTime startTime;
    @Schema(description = "종료 시간", example = "2025-05-13T11:00:00") private LocalDateTime endTime;
    @Schema(description = "메모", example = "회의 자료 준비") private String memo;
    @Schema(description = "일정 타입", example = "DEPARTMENT") private ScheduleType scheduleType;
    @Schema(description = "일정 상태", example = "중요회의") private ScheduleStatus scheduleStatus;
    @Schema(description = "부서 이름", example = "마케팅") private String departmentName;
    @Schema(description = "부서 Id", example = "1") private Long departmentId;
}
