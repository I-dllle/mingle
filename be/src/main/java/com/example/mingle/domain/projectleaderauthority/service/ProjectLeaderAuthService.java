package com.example.mingle.domain.projectleaderauthority.service;

import com.example.mingle.domain.projectleaderauthority.entity.Project;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.domain.projectleaderauthority.repository.ProjectRepository;
import com.example.mingle.domain.projectleaderauthority.entity.ProjectLeaderAuth;
import com.example.mingle.domain.projectleaderauthority.repository.ProjectLeaderAuthRepository;
import com.example.mingle.domain.projectleaderauthority.dto.ProjectResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectLeaderAuthService {

    private final UserRepository userRepository;
    private final ProjectLeaderAuthRepository projectLeaderAuthRepository;
    private final ProjectRepository projectRepository;



    /**
     * 프로젝트 리더 등록 (중복 방지 + 저장)
     */
    public void registerProjectLeader(String projectName, Long userId) {
        // 중복 등록 방지
        if (projectLeaderAuthRepository.findByProjectNameAndUserId(projectName, userId).isPresent()) {
            throw new IllegalArgumentException("이미 이 프로젝트의 리더로 등록된 유저입니다.");
        }

        ProjectLeaderAuth auth = ProjectLeaderAuth.builder()
                .project(projectRepository.save(Project.builder()
                        .name(projectName)
                        .endDate(null) // 종료일은 나중에 받아도 됩니다
                        .build()))
                .user(userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다.")))
                .grantedAt(LocalDateTime.now())
                .build();

        projectLeaderAuthRepository.save(auth);
    }



    /**
     * 해당 프로젝트의 리더 권한이 있는지 여부를 확인
     */
    public boolean isLeader(Long projectId, Long userId) {
        return projectLeaderAuthRepository.existsByProjectIdAndUserId(projectId, userId);
    }



    /**
     * getProjectsByLeader: DTO 변환을 fromEntity 정적 메서드로 처리
     */
    public List<ProjectResponseDto> getProjectsByLeader(Long userId) {
        return projectLeaderAuthRepository.findAllByUserId(userId).stream()
                .map(auth -> ProjectResponseDto.from(auth.getProject()))
                .collect(Collectors.toList());
    }
}