package com.example.mingle.domain.chat.archive.dto;

import com.example.mingle.domain.chat.archive.entity.ArchiveItem;
import com.example.mingle.domain.chat.archive.entity.ArchiveTag;

import java.time.LocalDateTime;
import java.util.List;

public record ArchiveItemResponse (
        Long id,
        String fileUrl,
        String fileName,
        String thumbnailUrl,
        List<String> tags,
        String uploaderNickname,

        // 업로드 일시
        LocalDateTime createdAt
) {
    public static ArchiveItemResponse from(ArchiveItem item) {
        return new ArchiveItemResponse(
                item.getId(),
                item.getFileUrl(),
                item.getOriginalFilename(),
                item.getThumbnailUrl(),
                item.getTags().stream().map(ArchiveTag::getName).toList(),
                item.getUploader().getNickname(),
                item.getCreatedAt()
        );
    }
}