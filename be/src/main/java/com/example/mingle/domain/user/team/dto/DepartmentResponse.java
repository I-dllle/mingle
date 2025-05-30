package com.example.mingle.domain.user.team.dto;

import com.example.mingle.domain.user.team.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class DepartmentResponse {
    private Long departmentId;
    private String departmentName;

    // Department 엔티티를 DepartmentResponse로 변환하는 정적 팩토리 메서드
    public static DepartmentResponse from(Department department) {
        return DepartmentResponse.builder()
                .departmentId(department.getId())
                .departmentName(department.getDepartmentName())
                .build();
    }
}
