package com.example.mingle.domain.user.team.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentResponse {
    private Long departmentId;
    private String departmentName;
}
