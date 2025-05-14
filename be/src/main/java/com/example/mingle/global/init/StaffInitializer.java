package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.*;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
import com.example.mingle.domain.user.user.repository.UserRepository;
import net.datafaker.Faker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Profile("dev") // !!!dev 환경에서만 실행!!!
@Component
@RequiredArgsConstructor
@Transactional
public class StaffInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final UserPositionRepository userPositionRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();
    private final Faker faker = new Faker();

    @Override
    public void run(String... args) {
        // 1. staff001 계정이 이미 있으면 skip
        boolean alreadyExists = userRepository.existsByLoginId("staff001");
        if (alreadyExists) return;

        // 2. 부서 또는 직책 없으면 skip
        if (departmentRepository.count() == 0 || userPositionRepository.count() == 0) {
            log.warn("[StaffInitializer] 부서가 아직 생성되지 않아 스태프 유저 생성을 건너뜁니다.");
            return;
        }

        // 2-1. Planning & A&R 부서 필수 확인
        if (!departmentRepository.existsByDepartmentName("Planning & A&R")) {
            log.warn("[StaffInitializer] 'Planning & A&R' 부서가 없어 staff001 계정을 건너뜁니다.");
            return;
        }

        // 3. 전체 부서 및 포지션 불러오기
        List<Department> departments = departmentRepository.findAll();
        List<UserPosition> positions = userPositionRepository.findAll();

        // 4. 부서명 → 포지션 매핑
        Map<String, List<UserPosition>> positionMap = positions.stream()
                .collect(Collectors.groupingBy(p -> p.getDepartment().getDepartmentName()));



        // 계정 생성

        // 대표 계정 staff001 생성 (Planning & A&R, A&R Planner 고정)
        /**
         * 언제나 존재하는, 프론트엔드/Swagger 테스트용 계정. (나머지 랜덤 더미 유저들과 구분하여 생성)
         * → 안정성 보장.
         *
         * loginId: staff001
         * password: staff1234!
         * department: Planning & A&R
         */
        Department planning = departmentRepository.findByDepartmentName("Planning & A&R")
                .orElseThrow(() -> new IllegalStateException("Planning & A&R 부서가 존재해야 합니다."));

        UserPosition defaultPosition = positionMap.getOrDefault("Planning & A&R", List.of()).stream()
                .filter(p -> p.getCode() == PositionCode.A_AND_R_PLANNER)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("A&R Planner 포지션이 필요합니다."));

        userRepository.save(User.builder()
                .loginId("staff001")
                .password(passwordEncoder.encode("staff1234!"))
                .nickname("avocado")
                .email("staff001@mingle.com")
                .phoneNum("010-0000-0001")
                .imageUrl(null)
                .role(UserRole.STAFF)
                .department(planning)
                .position(defaultPosition) // 직책
                .status(UserStatus.ONLINE)
                .build());

        // 더미 스태프 유저 30명 생성: staff002 ~ staff031
        /**
         * 다양한 부서에 랜덤으로 소속된 테스트 유저들을 생성
         * 목록 조회, 부서별 필터링, 정산/게시글/프로필 테스트 등에 활용
         */
        IntStream.rangeClosed(2, 31).forEach(i -> {
            Department randomDept = departments.get(random.nextInt(departments.size()));
            String deptName = randomDept.getDepartmentName();

            List<UserPosition> deptPositions = positionMap.getOrDefault(deptName, List.of());
            if (deptPositions.isEmpty()) return; // 해당 부서에 포지션 없음

            UserPosition selected = deptPositions.get(random.nextInt(deptPositions.size()));

            String loginId = "staff%03d".formatted(i);
            String nickname = faker.name().firstName(); // 무작위 이름
            String email = faker.internet().emailAddress(); // 무작위 이메일
            String phoneNum = "010-%04d-%04d".formatted(faker.number().numberBetween(1000, 9999), faker.number().numberBetween(1000, 9999));
            String imageUrl = faker.avatar().image(); // 무작위 아바타

            userRepository.save(User.builder()
                    .loginId(loginId)  // staff002 ~ staff031
                    .password(passwordEncoder.encode("staff1234!"))
                    .nickname(nickname)
                    .email(email)
                    .phoneNum(phoneNum)
                    .imageUrl(imageUrl)
                    .role(UserRole.STAFF)
                    .department(randomDept)
                    .position(selected)
                    .status(UserStatus.ONLINE)
                    .build());
        });
    }
}
