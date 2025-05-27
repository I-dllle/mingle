package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Order(1)
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
@Transactional
public class DepartmentInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;

    private static final List<String> DEFAULT_DEPARTMENTS = List.of(
            "Planning & A&R",
            "Creative Studio",
            "Finance & Legal",
            "Marketing & PR",
            "Artist & Manager",
            "System Operations"
//            "Executive"
    );

    @Override
    public void run(String... args) {
        try {
            // 부서가 이미 존재하면 실행하지 않음
            if (departmentRepository.count() > 0) {
                log.info("[DepartmentInitializer] 부서가 이미 존재하여 초기화를 건너뜁니다.");
                return;
            }

            log.info("[DepartmentInitializer] 기본 부서 생성을 시작합니다.");
            
            // 기본 부서 생성
            DEFAULT_DEPARTMENTS.forEach(deptName -> {
                Department dept = Department.builder()
                        .departmentName(deptName)
                        .build();
                departmentRepository.save(dept);
                log.info("[DepartmentInitializer] 부서 생성 완료: {}", deptName);
            });

            log.info("[DepartmentInitializer] 모든 기본 부서 생성이 완료되었습니다.");
        } catch (Exception e) {
            log.error("[DepartmentInitializer] 부서 초기화 중 오류가 발생했습니다.", e);
            throw e;
        }
    }
}
