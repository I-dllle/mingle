package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.entity.UserStatus;
import com.example.mingle.domain.user.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminInitializer {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // 이미 존재하면 중복 생성 방지
        if (userRepository.existsByLoginId("admin@admin.com")) return;

        // "System Operations" 부서 존재 여부 먼저 확인
        if (!departmentRepository.existsByDepartmentName("System Operations")) {
            log.warn("[AdminInitializer] 'System Operations' 부서가 아직 없어 관리자 계정 생성을 건너뜁니다.");
            return;
        }

        // System Operations 부서 조회 또는 예외
        Department sysOps = departmentRepository.findByDepartmentName("System Operations")
                .orElseThrow(() -> new IllegalStateException("System Operations 부서가 먼저 생성되어야 합니다."));

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
                .build());
    }
}
