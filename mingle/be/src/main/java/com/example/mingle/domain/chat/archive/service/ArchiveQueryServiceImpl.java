package com.example.mingle.domain.chat.archive.service;

import com.example.mingle.domain.chat.archive.dto.ArchiveAutoCompleteResponse;
import com.example.mingle.domain.chat.archive.dto.ArchiveItemResponse;
import com.example.mingle.domain.chat.archive.entity.ArchiveItem;
import com.example.mingle.domain.chat.archive.repository.ArchiveItemRepository;
import com.example.mingle.domain.chat.archive.repository.ArchiveTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArchiveQueryServiceImpl implements ArchiveQueryService {

    private final ArchiveItemRepository archiveItemRepository;
    private final ArchiveTagRepository archiveTagRepository;

    // 채팅방 자료 전체 조회
    @Override
    public List<ArchiveItemResponse> getFiles(Long chatRoomId, String type) {
        List<ArchiveItem> items = archiveItemRepository.findByChatRoomIdWithFilters(chatRoomId, type);
        return items.stream()
                .map(ArchiveItemResponse::from)
                .toList();
    }



    // 특정 태그로 필터링 조회
    @Override
    public List<ArchiveItemResponse> getFilesByTag(Long chatRoomId, String tag) {
        List<ArchiveItem> items = archiveItemRepository.findByChatRoomIdAndTagName(chatRoomId, tag);
        return items.stream()
                .map(ArchiveItemResponse::from)
                .toList();
    }



    // 자동완성: prefix로 시작하는 태그를 가진 자료 일부 미리보기
    @Override
    public List<ArchiveAutoCompleteResponse> searchTagsByPrefix(String prefix) {
        return archiveTagRepository.findTop5ByNameStartingWith(prefix).stream()
                .map(tag -> {
                    ArchiveItem item = tag.getArchiveItem();
                    return ArchiveAutoCompleteResponse.builder()
                            .id(item.getId())
                            .fileUrl(item.getFileUrl())
                            .previewTitle(item.getOriginalFilename())
                            .thumbnailUrl(item.getThumbnailUrl())
                            .build();
                }).toList();
    }
}
