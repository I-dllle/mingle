package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Slf4j
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
public class DepartmentSeeder {

    private final DepartmentRepository departmentRepository;

    public void seed() {
        String deptName = "System Operations";

        if (departmentRepository.existsByDepartmentName(deptName)) {
            log.info("[DepartmentSeeder] '{}' 부서는 이미 존재합니다.", deptName);
            return;
        }

        departmentRepository.save(Department.builder()
                .departmentName(deptName)
                .build());

        log.info("[DepartmentSeeder] '{}' 부서를 생성했습니다.", deptName);
    }
}
