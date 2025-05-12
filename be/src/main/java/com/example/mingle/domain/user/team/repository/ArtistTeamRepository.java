package com.example.mingle.domain.user.team.repository;

import com.example.mingle.domain.user.team.entity.ArtistTeam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistTeamRepository extends JpaRepository<ArtistTeam, Long> {
    //아티스트 팀을 이름으로 찾기
    Optional<ArtistTeam> findByName(String name);
}
