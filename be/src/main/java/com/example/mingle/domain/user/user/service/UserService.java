package com.example.mingle.domain.user.user.service;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.dto.LoginRequestDto;
import com.example.mingle.domain.user.user.dto.SignupRequestDto;
import com.example.mingle.domain.user.user.dto.TokenResponseDto;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    // SIGNUP
    public void signup(SignupRequestDto request) {
        // 중복 체크 (loginId, email)
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 부서 조회
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("부서를 찾을 수 없습니다."));

        // 유저 생성
        User user = User.builder()
                .loginId(request.getLoginId())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .email(request.getEmail())
                .phoneNum(request.getPhoneNum())
                .imageUrl(request.getImageUrl())
                .role(UserRole.valueOf(request.getRole()))
                .department(department)
                .build();

        userRepository.save(user);
    }



    // LOGIN
    public TokenResponseDto login(LoginRequestDto request) {
        String identifier = request.getLoginId(); // 사용자가 입력한 ID 또는 이메일

        // 입력값이 이메일인지 loginId인지 판단해서 사용자 조회
        Optional<User> userOptional;
        if (identifier.contains("@")) {
            userOptional = userRepository.findByEmail(identifier);
        } else {
            userOptional = userRepository.findByLoginId(identifier);
        }

        // 사용자 정보가 없으면 예외 발생
        User user = userOptional
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        // 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // 임시 토큰 반환 (다음 이슈에서 JWT 적용 예정)
        String token = "TEMP_TOKEN";

        // 토큰 응답 DTO에 담아서 반환
        return new TokenResponseDto(token);
    }
}
