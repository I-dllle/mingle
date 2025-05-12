package com.example.mingle.domain.user.artist.repository;

import com.example.mingle.domain.user.artist.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    //아티스트를 팀/유닛으로 찾기
    Optional<Artist> findByTeam(String teamName);

    //아티스트를 활동명으로 찾기
    Optional<Artist> findByStageName(String stageName);
}
