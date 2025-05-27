package com.example.mingle.domain.chat.archive.repository;

import com.example.mingle.domain.chat.archive.entity.ArchiveItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchiveItemRepository extends JpaRepository<ArchiveItem, Long> {

    // 특정 채팅방에 속한 자료들 전체조회
    List<ArchiveItem> findByChatRoomId(Long chatRoomId);

    // 채팅방 ID + 확장자(type) 필터 + 최신순 정렬
    @Query("SELECT ai FROM ArchiveItem ai " +
            "WHERE ai.chatRoomId = :chatRoomId " +
            "AND (:type IS NULL OR LOWER(ai.originalFilename) LIKE %:type) " +
            "ORDER BY ai.createdAt DESC")
    List<ArchiveItem> findByChatRoomIdWithFilters(@Param("chatRoomId") Long chatRoomId,
                                                  @Param("type") String type);

    /// 특정 태그로 자료 필터링 (JOIN + WHERE)
    @Query("SELECT ai FROM ArchiveItem ai JOIN ai.tags t " +
            "WHERE ai.chatRoomId = :chatRoomId AND t.name = :tag")
    List<ArchiveItem> findByChatRoomIdAndTagName(@Param("chatRoomId") Long chatRoomId,
                                                 @Param("tag") String tag);
}

