package com.example.mingle.domain.chat.archive.controller;

import com.example.mingle.domain.chat.archive.dto.ArchiveAutoCompleteResponse;
import com.example.mingle.domain.chat.archive.dto.ArchiveItemResponse;
import com.example.mingle.domain.chat.archive.dto.ArchiveUploadRequest;
import com.example.mingle.domain.chat.archive.dto.ArchiveTagUpdateRequest;
import com.example.mingle.domain.chat.archive.service.ArchiveQueryService;
import com.example.mingle.domain.chat.archive.service.ArchiveUploadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/archive")
@RequiredArgsConstructor
public class ApiV1ArchiveItemController {

    private final ArchiveQueryService archiveQueryService;
    private final ArchiveUploadService archiveUploadService;

    // 1. 자료 업로드
    @PostMapping
    public ResponseEntity<String> upload(@ModelAttribute ArchiveUploadRequest request) throws IOException {
        archiveUploadService.upload(request);
        return ResponseEntity.ok("업로드 완료");
    }

    // 2. 채팅방 ID 기준 전체 자료 조회
    @GetMapping("/{chatRoomId}")
    public List<ArchiveItemResponse> getFiles(
            @PathVariable Long chatRoomId,
            @RequestParam(required = false) String type
    ) {
        return archiveQueryService.getFiles(chatRoomId, type);
    }

    // 3. 태그로 필터링된 자료 조회
    @GetMapping("/{chatRoomId}/filter")
    public List<ArchiveItemResponse> getFilesByTag(@PathVariable Long chatRoomId,
                                                   @RequestParam String tag) {
        return archiveQueryService.getFilesByTag(chatRoomId, tag);
    }

    // 4. 자료 삭제 (추후 구현)
    @DeleteMapping("/{archiveItemId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long archiveItemId) {
        archiveUploadService.delete(archiveItemId); // 실제 삭제 메서드 연결
        return ResponseEntity.noContent().build();
    }

    // 5. 자료 태그 수정 (추후 구현)
    @PatchMapping("/{archiveItemId}/tags")
    public ResponseEntity<Void> updateTags(@PathVariable Long archiveItemId,
                                           @RequestBody @Valid ArchiveTagUpdateRequest request) {
        // ArchiveUploadService의 태그 수정 로직
        archiveUploadService.updateTags(archiveItemId, request.getTags()); // 서비스에 전달
        return ResponseEntity.ok().build();
    }

    // 6. 자동완성용 태그 검색 (추후 구현)
    @GetMapping("/tags/search")
    public List<ArchiveAutoCompleteResponse> searchTags(@RequestParam String prefix) {
        return archiveQueryService.searchTagsByPrefix(prefix);
    }
}
