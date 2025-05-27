package com.example.mingle.domain.chat.archive.dto;

import lombok.Builder;

// 자동완성용 자료 응답 DTO
@Builder
public record ArchiveAutoCompleteResponse(
        Long id,             // 자료 ID
        String previewTitle, // 미리보기 제목 (파일명 기반)
        String fileUrl,      // S3 URL
        String thumbnailUrl  // 썸네일 URL (이미지일 경우만)
) {}
