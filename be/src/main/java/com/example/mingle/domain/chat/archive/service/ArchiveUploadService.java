package com.example.mingle.domain.chat.archive.service;

import com.example.mingle.domain.chat.archive.dto.ArchiveUploadRequest;

import java.util.List;
import java.io.IOException;

public interface ArchiveUploadService {

    // 실제 파일 업로드 + 태그 저장
    void upload(ArchiveUploadRequest request) throws IOException;

    // 태그 수정용 메서드
    void updateTags(Long archiveItemId, List<String> tags);

    // 자료 삭제 메서드 정의
    void delete(Long archiveItemId);
}
