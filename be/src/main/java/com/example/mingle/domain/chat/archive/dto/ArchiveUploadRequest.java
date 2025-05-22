package com.example.mingle.domain.chat.archive.dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public record ArchiveUploadRequest(

        @NotNull(message = "채팅방 ID는 필수입니다.")
        Long chatRoomId,

        @NotNull(message = "업로더 ID는 필수입니다.")
        Long uploaderId,

        @NotNull(message = "파일은 필수입니다.")
        MultipartFile file, // 실제 업로드 파일

        List<String> tags // 수동 등록된 태그 (예: #아이디어, #회의)

) {}
