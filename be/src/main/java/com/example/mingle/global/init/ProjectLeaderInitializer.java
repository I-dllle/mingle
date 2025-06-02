package com.example.mingle.global.init;

import com.example.mingle.domain.user.user.entity.UserStatus;
import com.example.mingle.domain.projectleaderauthority.entity.Project;
import com.example.mingle.domain.projectleaderauthority.service.ProjectLeaderAuthService;
import com.example.mingle.domain.projectleaderauthority.service.ProjectService;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.entity.PresenceStatus;
import com.example.mingle.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Order(4)
@Slf4j
@Profile({"dev", "prod"})
@Component
@RequiredArgsConstructor
@Transactional
public class ProjectLeaderInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectService projectService;
    private final ProjectLeaderAuthService projectLeaderAuthService;

    @Override
    public void run(String... args) {
        // 이미 존재하는 유저 사용하거나 새로 생성
        User leader = userRepository.findByLoginId("leader001")
                .orElseGet(() -> {
                    return userRepository.save(User.builder()
                            .loginId("leader001")
                            .password("1234")  // 인코딩 생략 or 적용
                            .nickname("리더몽")
                            .role(UserRole.STAFF)  // STAFF지만 project-leader 권한만 부여됨
                            .presence(PresenceStatus.ONLINE)
                            .status(UserStatus.ACTIVE)
                            .build());
                });

        // 중복 프로젝트 리더 등록 방지
        boolean alreadyRegistered = projectLeaderAuthService
                .getProjectsByLeader(leader.getId())
                .stream()
                .anyMatch(p -> p.getProjectName().equals("테스트 프로젝트"));

        if (alreadyRegistered) {
            log.warn("[ProjectLeaderInitializer] leader001은 이미 '테스트 프로젝트'의 리더로 등록되어 있습니다. 초기화 건너뜀.");
            return;
        }

        // 프로젝트 생성
        Project project = projectService.create("테스트 프로젝트", LocalDate.of(2025, 12, 31));

        // 리더 권한 부여
        projectLeaderAuthService.registerProjectLeader(project.getName(), leader.getId());
    }
}
