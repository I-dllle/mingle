package com.example.mingle.domain.chat.archive.repository;

import com.example.mingle.domain.chat.archive.entity.ArchiveItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArchiveItemRepository extends JpaRepository<ArchiveItem, Long> {

    List<ArchiveItem> findByChatRoomId(Long chatRoomId);

    List<ArchiveItem> findByChatRoomIdAndTagsContaining(Long chatRoomId, String tag);
}

