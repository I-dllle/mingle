package com.example.mingle.domain.user.user.service;

import com.example.mingle.domain.user.team.entity.Department;
import com.example.mingle.domain.user.team.repository.DepartmentRepository;
import com.example.mingle.domain.user.user.dto.ProfileUpdateRequestDto;
import com.example.mingle.domain.user.user.dto.SignupRequestDto;
import com.example.mingle.domain.user.user.entity.*;
import com.example.mingle.domain.user.user.repository.UserPositionRepository;
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
    private final UserPositionRepository userPositionRepository;
    private final PasswordEncoder passwordEncoder;

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
        Department department = departmentRepository.findByDepartmentName(request.getDepartmentName())
                .orElseThrow(() -> new IllegalArgumentException("부서를 찾을 수 없습니다."));

        // 직급 조회
        UserPosition position = userPositionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("포지션을 찾을 수 없습니다."));

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
                .position(position)
                .status(UserStatus.ACTIVE)               // 계정 활성 상태
                .presence(PresenceStatus.OFFLINE)        // 가입 후 접속 전 상태
                .build();

        return userRepository.save(user);
    }



    @Transactional
    public void updateUser(User user) {
        userRepository.save(user);
    }



    public List<User> getUsersByDepartmentName(String name) {
        return userRepository.findByDepartment_DepartmentName(name);
    }



    /**
     * 현재 로그인한 유저의 프로필 수정
     * → nickname, email, phoneNum, imageUrl 필드만 업데이트
     * → null 값은 무시하고 기존 값 유지
     */
    @Transactional
    public User updateMyProfile(User actor, ProfileUpdateRequestDto dto) {
        // 기존 사용자 다시 조회 (loginId, password 등 필드 포함된 진짜 엔티티)
        User user = userRepository.findById(actor.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));

        if (dto.getNickname() != null) user.setNickname(dto.getNickname());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPositionId() != null) {
            UserPosition position = userPositionRepository.findById(dto.getPositionId())
                    .orElseThrow(() -> new ApiException(ErrorCode.USER_POSITION_NOT_FOUND));
            user.setPosition(position);
        }
        if (dto.getPhoneNum() != null) user.setPhoneNum(dto.getPhoneNum());
        if (dto.getImageUrl() != null) user.setImageUrl(dto.getImageUrl());

        return userRepository.save(user);
    }



    /**
     * 특정 유저 ID로 유저 조회
     * → UserController에서 프로필 조회 등에 사용
     * → 존재하지 않으면 USER_NOT_FOUND 예외 발생
     */
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findByIdWithRelations(id)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
    }

}
