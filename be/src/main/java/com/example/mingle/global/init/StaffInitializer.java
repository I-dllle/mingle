package com.example.mingle.global.init;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.entity.UserStatus;
import com.example.mingle.domain.user.user.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class StaffInitializer {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @PostConstruct
    public void init() {
        boolean alreadyExists = userRepository.existsByLoginId("staff001");
        if (alreadyExists) return;

        List<Department> departments = departmentRepository.findAll();

        if (departments.isEmpty()) {
            throw new IllegalStateException("부서가 먼저 생성되어야 합니다.");
        }

        // 대표 테스트 계정 생성: staff001
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

        userRepository.save(User.builder()
                .loginId("staff001")
                .password(passwordEncoder.encode("staff1234!"))
                .nickname("A&R 담당자")
                .email("staff001@mingle.com")
                .phoneNum("010-0000-0001")
                .imageUrl(null)
                .role(UserRole.STAFF)
                .status(UserStatus.ONLINE)
                .department(planning)
                .build());

        // 더미 스태프 유저 30명 생성: staff002 ~ staff031
        /**
         * 다양한 부서에 랜덤으로 소속된 테스트 유저들을 생성
         * 목록 조회, 부서별 필터링, 정산/게시글/프로필 테스트 등에 활용
         */
        IntStream.rangeClosed(2, 31).forEach(i -> {
            Department randomDept = departments.get(random.nextInt(departments.size()));

            userRepository.save(User.builder()
                    .loginId("staff%03d".formatted(i))  // staff002 ~ staff031
                    .password(passwordEncoder.encode("staff1234!"))
                    .nickname("스태프 %d".formatted(i))
                    .email("staff%03d@mingle.com".formatted(i))
                    .phoneNum("010-0000-%04d".formatted(i))
                    .imageUrl(null)
                    .role(UserRole.STAFF)
                    .status(UserStatus.ONLINE)
                    .department(randomDept)
                    .build());
        });
    }
}
