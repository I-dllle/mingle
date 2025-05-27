package com.example.mingle.domain.chat.archive.service;

import com.example.mingle.domain.chat.archive.dto.ArchiveItemResponse;
import com.example.mingle.domain.chat.archive.dto.ArchiveAutoCompleteResponse;

import java.util.List;

public interface ArchiveQueryService {

    List<ArchiveItemResponse> getFiles(Long chatRoomId, String type);

    List<ArchiveItemResponse> getFilesByTag(Long chatRoomId, String tag);

    // 자동완성용 자료 추천
    List<ArchiveAutoCompleteResponse> searchTagsByPrefix(String prefix);
}
