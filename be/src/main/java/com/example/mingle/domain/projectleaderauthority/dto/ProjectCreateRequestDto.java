package com.example.mingle.domain.projectleaderauthority.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class ProjectCreateRequestDto {
    private String projectName;
    private LocalDate endDate;
}
