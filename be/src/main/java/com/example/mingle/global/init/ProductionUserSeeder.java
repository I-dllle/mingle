package com.example.mingle.global.init;

import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.entity.UserStatus;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.PositionCode;
import com.example.mingle.domain.user.user.entity.UserPosition;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Slf4j
@Profile("prod") // 운영 환경에서만 실행
@Component
@RequiredArgsConstructor
public class ProductionUserSeeder {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserPositionRepository userPositionRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seed() {
        try {
            if (userRepository.count() > 0) {
                log.warn("[ProductionUserSeeder] 유저가 이미 존재하여 seed 실행을 건너뜁니다.");
                return;
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    new ClassPathResource("seed/staff_seed.csv").getInputStream(), StandardCharsets.UTF_8));

            String line;
            while ((line = br.readLine()) != null) {
                if (line.startsWith("loginId")) continue; // 헤더는 건너뜀

                String[] parts = line.split(",");
                if (parts.length != 5) continue;

                String loginId = parts[0].trim();
                String nickname = parts[1].trim();
                String email = parts[2].trim();
                String positionCode = parts[3].trim();
                String departmentName = parts[4].trim();

                Department dept = departmentRepository.findByDepartmentName(departmentName)
                        .orElseThrow(() -> new IllegalStateException("부서 없음: " + departmentName));
                UserPosition position = userPositionRepository.findByCode(PositionCode.valueOf(positionCode))
                        .orElseThrow(() -> new IllegalStateException("포지션 없음: " + positionCode));

                userRepository.save(User.builder()
                        .loginId(loginId)
                        .nickname(nickname)
                        .email(email)
                        .password(passwordEncoder.encode("1234")) // 기본 패스워드
                        .department(dept)
                        .position(position)
                        .role(UserRole.STAFF)
                        .status(UserStatus.ONLINE)
                        .build());

                log.info("[ProductionUserSeeder] 유저 추가: {}", loginId);
            }

            br.close();
        } catch (Exception e) {
            log.error("📛 [ProductionUserSeeder] 유저 seed 실패", e);
        }
    }
}
