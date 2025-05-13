package com.example.mingle.domain.user.user.service;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.dto.LoginRequestDto;
import com.example.mingle.domain.user.user.dto.SignupRequestDto;
import com.example.mingle.domain.user.user.dto.TokenResponseDto;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthTokenService authTokenService;

    /**
     * 회원가입
     */
    @Transactional
    public User signup(SignupRequestDto request) {
        // 이메일 자동 복사: loginId가 이메일 형식인데 email이 비어 있으면 복사
        if ((request.getEmail() == null || request.getEmail().isBlank())
                && request.getLoginId().contains("@")) {
            request.setEmail(request.getLoginId());
        }

        // 이메일 중복 체크
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

        return userRepository.save(user);
    }



    /**
     * 로그인
     */
    @Transactional
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
            throw new ApiException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = authTokenService.genAccessToken(user);

        // 리프레시 토큰 생성
        String refreshToken = authTokenService.genRefreshToken(user);

        // 리프레시 토큰 저장
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new TokenResponseDto(accessToken);
    }



    // refreshToken을 받아 access + refresh 토큰을 새로 발급해주는 메서드
    @Transactional
    public TokenResponseDto refreshToken(String refreshToken) {
        // 1. 토큰 유효성 검사
        if (!authTokenService.isValid(refreshToken)) {
            throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        // 2. refreshToken과 일치하는 유저 조회
        User user = userRepository.findByRefreshToken(refreshToken)
                .filter(u -> u.getRefreshToken().equals(refreshToken))  // 보안상 재확인
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_REFRESH_TOKEN));

        // 3. 새 토큰 발급
        String newAccessToken = authTokenService.genAccessToken(user);
        String newRefreshToken = authTokenService.genRefreshToken(user);

        // 4. refreshToken 업데이트 후 저장
        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        // 5. 응답
        return new TokenResponseDto(newAccessToken);
    }



    /**
     * AccessToken을 통해 사용자 정보 파싱
     * → Rq.getUserFromAccessToken()에서 사용
     */
    public User getUserFromAccessToken(String accessToken) {
        Map<String, Object> payload = authTokenService.payload(accessToken);

        if (payload == null) return null;

        long id = ((Number) payload.get("id")).longValue();
        String email = (String) payload.get("email");
        String nickname = (String) payload.get("nickname");
        String roleString = (String) payload.get("role");
        UserRole role = UserRole.valueOf(roleString);

        return User.builder()
                .id(id)
                .email(email)
                .nickname(nickname)
                .role(role)
                .build();
    }



    /**
     * accessToken 생성 (AuthTokenService 위임)
     * → Rq.makeAuthCookies(), Rq.refreshAccessToken() 등에서 사용
     */
    public String genAccessToken(User user) {
        return authTokenService.genAccessToken(user);
    }



    /**
     * refreshToken으로 사용자 조회
     * → Rq.refreshAccessTokenByRefreshToken()에서 사용
     */
    @Transactional(readOnly = true)
    public Optional<User> findByRefreshToken(String refreshToken) {
        return userRepository.findByRefreshToken(refreshToken);
    }



    @Transactional
    public void updateUser(User user) {
        userRepository.save(user);
    }



    public List<User> getUsersByDepartmentName(String name) {
        return userRepository.findByDepartment_DepartmentName(name);
    }
}
