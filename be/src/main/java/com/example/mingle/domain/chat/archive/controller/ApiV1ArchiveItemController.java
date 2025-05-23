package com.example.mingle.domain.chat.archive.controller;

import com.example.mingle.domain.chat.archive.dto.ArchiveAutoCompleteResponse;
import com.example.mingle.domain.chat.archive.dto.ArchiveItemResponse;
import com.example.mingle.domain.chat.archive.dto.ArchiveUploadRequest;
import com.example.mingle.domain.chat.archive.dto.ArchiveTagUpdateRequest;
import com.example.mingle.domain.chat.archive.service.ArchiveQueryService;
import com.example.mingle.domain.chat.archive.service.ArchiveUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/archive")
@RequiredArgsConstructor
@Tag(name = "Archive API", description = "자료방 관련 API")
public class ApiV1ArchiveItemController {

    private final ArchiveQueryService archiveQueryService;
    private final ArchiveUploadService archiveUploadService;

    // 1. 자료 업로드
    @Operation(
            summary = "자료 업로드",
            description = """
  채팅방 내 자료방에 파일을 업로드합니다.

  • 채팅방 ID, 업로더 ID, 파일 URL, 썸네일 등 정보 저장
  • 태그는 수동 입력 또는 파일명 기반 자동 추출
  • 업로드된 자료는 채팅 메시지(ARCHIVE 포맷)로도 연동 가능
  """
    )
    @PostMapping
    public ResponseEntity<String> upload(@ModelAttribute ArchiveUploadRequest request) throws IOException {
        archiveUploadService.upload(request);
        return ResponseEntity.ok("업로드 완료");
    }

    // 2. 채팅방 ID 기준 전체 자료 조회
    @Operation(
            summary = "자료 전체 조회 (채팅방 기준)",
            description = """
  특정 채팅방에 업로드된 모든 자료를 조회합니다.

  • 업로더, 파일명, 업로드 시간, 태그 정보 포함
  • 파일 타입 필터링(optional): type=pdf, image, etc
  """
    )
    @GetMapping("/{chatRoomId}")
    public List<ArchiveItemResponse> getFiles(
            @PathVariable Long chatRoomId,
            @RequestParam(required = false) String type
    ) {
        return archiveQueryService.getFiles(chatRoomId, type);
    }

    // 3. 태그로 필터링된 자료 조회
    @Operation(
            summary = "태그 기반 자료 필터링 조회",
            description = """
  채팅방 자료 중 특정 태그가 포함된 항목만 필터링합니다.

  • 복수 태그는 지원하지 않음 (단일 태그 기준)
  • 태그는 업로드 시 자동 추출되거나 수동 입력 가능
  """
    )
    @GetMapping("/{chatRoomId}/filter")
    public List<ArchiveItemResponse> getFilesByTag(@PathVariable Long chatRoomId,
                                                   @RequestParam String tag) {
        return archiveQueryService.getFilesByTag(chatRoomId, tag);
    }

    // 4. 자료 삭제 (추후 구현)
    @Operation(
            summary = "자료 삭제",
            description = """
  채팅방 자료방에서 파일을 삭제합니다.

  • 업로더 본인 또는 관리자만 삭제 권한
  • 실제 S3 삭제와 DB 기록 삭제 모두 수행
  """
    )
    @DeleteMapping("/{archiveItemId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long archiveItemId) {
        archiveUploadService.delete(archiveItemId); // 실제 삭제 메서드 연결
        return ResponseEntity.noContent().build();
    }

    // 5. 자료 태그 수정 (추후 구현)
    @Operation(
            summary = "자료 태그 수정",
            description = """
  업로드된 자료의 태그를 수정합니다.

  • 기존 태그를 모두 대체 (덧붙이기 아님)
  • 정규식 기반 자동 추출과 별도로, 수동 편집 가능
  """
    )
    @PatchMapping("/{archiveItemId}/tags")
    public ResponseEntity<Void> updateTags(@PathVariable Long archiveItemId,
                                           @RequestBody @Valid ArchiveTagUpdateRequest request) {
        // ArchiveUploadService의 태그 수정 로직
        archiveUploadService.updateTags(archiveItemId, request.getTags()); // 서비스에 전달
        return ResponseEntity.ok().build();
    }

    // 6. 자동완성용 태그 검색 (추후 구현)
    @Operation(
            summary = "태그 자동완성 검색",
            description = """
  `#단어` 입력 시 자동완성 추천을 제공합니다.

  • 최대 5개까지 추천
  • prefix 기준 LIKE 검색 (e.g. 'pl' ➝ ['planning', 'player', ...])
  """
    )
    @GetMapping("/tags/search")
    public List<ArchiveAutoCompleteResponse> searchTags(@RequestParam String prefix) {
        return archiveQueryService.searchTagsByPrefix(prefix);
    }
}
