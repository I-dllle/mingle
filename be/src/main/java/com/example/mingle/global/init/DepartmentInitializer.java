package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
public class DepartmentInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) {
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
