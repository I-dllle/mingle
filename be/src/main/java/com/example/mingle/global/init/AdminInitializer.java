package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.*;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.user.user.entity.UserStatus;
import com.example.mingle.domain.user.user.entity.PresenceStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Order(3)
@Slf4j
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
@Transactional
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserPositionRepository userPositionRepository;
    private final PasswordEncoder passwordEncoder;



    @Override
    public void run(String... args) {
        // 이미 존재하면 중복 생성 방지
        if (userRepository.existsByLoginId("admin@admin.com")) return;

        if (!departmentRepository.existsByDepartmentName("System Operations")) {
            log.warn("[AdminInitializer] 'System Operations' 부서가 아직 없어 관리자 계정 생성을 건너뜁니다.");
            return; // 예외 없이 정상 종료
        }

        // System Operations 부서 조회 또는 예외
        Department sysOps = departmentRepository.findByDepartmentName("System Operations")
                .orElseThrow();

        // 포지션 확인: WEBOPS_MANAGER
        UserPosition position = userPositionRepository.findAll().stream()
                .filter(p -> p.getDepartment().getDepartmentName().equals("System Operations"))
                .filter(p -> p.getCode() == PositionCode.WEBOPS_MANAGER)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("WebOps Manager 포지션이 필요합니다."));




        // 시스템 관리자 계정 생성
        userRepository.save(User.builder()
                .loginId("admin@admin.com")
                .password(passwordEncoder.encode("Admin1234!"))
                .nickname("운영자")
                .email("admin@admin.com")
                .phoneNum("010-9999-0000")
                .imageUrl(null)
                .role(UserRole.ADMIN)
                .status(UserStatus.ACTIVE) // 계정 상태
                .presence(PresenceStatus.OFFLINE) // 초기 접속 상태
                .department(sysOps)
                .position(position)
                .build());
    }
}
