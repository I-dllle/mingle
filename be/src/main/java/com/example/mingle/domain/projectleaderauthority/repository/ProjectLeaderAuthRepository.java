package com.example.mingle.domain.projectleaderauthority.repository;

import com.example.mingle.domain.projectleaderauthority.entity.ProjectLeaderAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectLeaderAuthRepository extends JpaRepository<ProjectLeaderAuth, Long> {

    // 프로젝트 이름 + 유저 ID 기준으로 권한 조회 (중복 등록 방지 등 단일 조회에 사용)
    Optional<ProjectLeaderAuth> findByProjectNameAndUserId(String projectName, Long userId);

    // 프로젝트 이름 + 유저 ID가 이미 등록돼 있는지 확인 (중복 여부 체크용)
    boolean existsByProjectNameAndUserId(String projectName, Long userId);

    // 특정 유저가 리더로 등록된 모든 프로젝트 조회
    // 프로젝트 채팅방 목록을 조회할 때 필요함
    List<ProjectLeaderAuth> findAllByUserId(Long userId);
}
