package com.example.mingle.domain.projectleaderauthority.service;

import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.projectleaderauthority.entity.ProjectLeaderAuth;
import com.example.mingle.domain.projectleaderauthority.repository.ProjectLeaderAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProjectLeaderAuthService {

    private final UserRepository userRepository;
    private final ProjectLeaderAuthRepository projectLeaderAuthRepository;

    public void registerProjectLeader(String projectName, Long userId) {
        // 중복 등록 방지
        if (projectLeaderAuthRepository.findByProjectNameAndUserId(projectName, userId).isPresent()) {
            throw new IllegalArgumentException("이미 이 프로젝트의 리더로 등록된 유저입니다.");
        }

        ProjectLeaderAuth auth = ProjectLeaderAuth.builder()
                .projectName(projectName)
                .user(userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다.")))
                .grantedAt(LocalDateTime.now())
                .build();

        projectLeaderAuthRepository.save(auth);
    }


    /**
     * 해당 프로젝트의 리더 권한이 있는지 여부를 확인
     */
    public boolean isLeader(String projectName, Long userId) {
        return projectLeaderAuthRepository.existsByProjectNameAndUserId(projectName, userId);
    }
}