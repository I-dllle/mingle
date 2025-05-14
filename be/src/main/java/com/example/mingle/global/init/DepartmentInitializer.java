package com.example.mingle.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DepartmentInitializer {

    private final DepartmentRepository departmentRepository;

    @PostConstruct
    public void init() {
        // 부서가 이미 존재하면 실행하지 않음
        if (departmentRepository.count() > 0) return;

        departmentRepository.save(Department.builder().departmentName("Planning & A&R").build());
        departmentRepository.save(Department.builder().departmentName("Creative Studio").build());
        departmentRepository.save(Department.builder().departmentName("Finance & Legal").build());
        departmentRepository.save(Department.builder().departmentName("Marketing & PR").build());
        departmentRepository.save(Department.builder().departmentName("Artist & Manager").build());
        departmentRepository.save(Department.builder().departmentName("System Operations").build());
        departmentRepository.save(Department.builder().departmentName("Executive").build());
    }
}
