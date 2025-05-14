package com.example.mingle.domain.user.artist.repository;

import com.example.mingle.domain.user.artist.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    //아티스트를 팀/유닛으로 찾기
    @Query("""
    SELECT a FROM Artist a
    JOIN a.teams t
    WHERE t.name = :teamName
    """)
    Optional<Artist> findByTeamName(@Param("teamName") String teamName);

    //아티스트를 활동명으로 찾기
    Optional<Artist> findByStageName(String stageName);
}
