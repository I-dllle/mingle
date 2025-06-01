package com.example.mingle.domain.user.team.controller;

import com.example.mingle.domain.user.team.dto.DepartmentResponse;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/departments")
public class ApiV1DepartmentController {
    private final DepartmentRepository departmentRepository;

    /**
     * 모든 부서 목록 조회 API
     * - 채팅방 생성 시 부서 선택 드롭다운에 사용
     */
    @GetMapping
    public List<DepartmentResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(DepartmentResponse::from)
                .toList();
    }
}
