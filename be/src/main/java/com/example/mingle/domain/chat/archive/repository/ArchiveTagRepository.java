package com.example.mingle.domain.chat.archive.repository;

import com.example.mingle.domain.chat.archive.entity.ArchiveTag;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ArchiveTagRepository extends JpaRepository<ArchiveTag, Long> {

    // 자동완성용: prefix로 시작하는 태그 중 최근 자료 기준 상위 5개 반환
    List<ArchiveTag> findTop5ByNameStartingWith(String prefix);

    // 특정 자료에 연결된 태그 전부 삭제
    @Modifying(clearAutomatically = true) // 영속성 컨텍스트 반영 위해 clearAutomatically 옵션 추가
    @Query("DELETE FROM ArchiveTag t WHERE t.archiveItem.id = :archiveItemId")
    void deleteAllByArchiveItemId(@Param("archiveItemId") Long archiveItemId);
}
