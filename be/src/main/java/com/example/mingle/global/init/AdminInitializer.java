package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.*;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
import com.example.mingle.domain.user.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserPositionRepository userPositionRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
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
                .status(UserStatus.ONLINE)
                .department(sysOps)
                .position(position)
                .build());
    }
}
