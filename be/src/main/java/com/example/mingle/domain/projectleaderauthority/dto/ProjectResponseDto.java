package com.example.mingle.domain.projectleaderauthority.dto;

import com.example.mingle.domain.projectleaderauthority.entity.Project;
import com.example.mingle.domain.projectleaderauthority.entity.ProjectLeaderAuth;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProjectResponseDto {
    private Long projectId;
    private String projectName;
    private LocalDate endDate; // 종료일 필드

    // entity → dto 변환용 팩토리 메서드
    public static ProjectResponseDto from(Project project) {
        return new ProjectResponseDto(project.getId(), project.getName(), project.getEndDate());
    }
}
