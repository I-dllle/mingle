package com.example.mingle.domain.chat.archive.service;

import com.example.mingle.domain.chat.archive.dto.ArchiveUploadRequest;
import com.example.mingle.domain.chat.archive.entity.ArchiveItem;
import com.example.mingle.domain.chat.archive.entity.ArchiveTag;
import com.example.mingle.domain.chat.archive.repository.ArchiveItemRepository;
import com.example.mingle.domain.chat.archive.repository.ArchiveTagRepository;
import com.example.mingle.global.aws.AwsS3Uploader;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArchiveUploadServiceImpl implements ArchiveUploadService {

    private final ArchiveItemRepository archiveItemRepository;
    private final ArchiveTagRepository archiveTagRepository;
    private final AwsS3Uploader awsS3Uploader;

    @Override
    public void upload(ArchiveUploadRequest request) throws IOException {

        // 1. S3에 업로드
        String fileUrl = awsS3Uploader.upload(request.file(), "archive_files");

        // 2. ArchiveItem 생성
        ArchiveItem archiveItem = ArchiveItem.builder()
                .chatRoomId(request.chatRoomId())
                .uploaderId(request.uploaderId())
                .fileUrl(fileUrl)
                .originalFilename(request.file().getOriginalFilename())
                .thumbnailUrl(null) // 이미지 파일이 아니라면 비워둠 (후처리로 가능)
                .build();

        // 3. 태그 처리
        if (request.tags() != null && !request.tags().isEmpty()) {
            List<ArchiveTag> tagEntities = request.tags().stream()
                    .map(tagName -> ArchiveTag.builder()
                            .name(tagName)
                            .archiveItem(archiveItem)
                            .build())
                    .toList();
            archiveItem.getTags().addAll(tagEntities);
        }

        // 4. 저장
        archiveItemRepository.save(archiveItem);
    }



    @Transactional
    @Override
    public void updateTags(Long archiveItemId, List<String> tags) {
        // 기존 자료 유효성 확인
        ArchiveItem archiveItem = archiveItemRepository.findById(archiveItemId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ARCHIVE));

        // 기존 태그 전부 삭제
        archiveTagRepository.deleteAllByArchiveItemId(archiveItemId);

        // 새 태그 리스트 저장
        List<ArchiveTag> newTags = tags.stream()
                .map(tag -> ArchiveTag.of(tag, archiveItem)) // ArchiveTag.of()는 정적 생성자
                .toList();

        archiveTagRepository.saveAll(newTags);
    }



    @Transactional
    @Override
    public void delete(Long archiveItemId) {
        ArchiveItem archiveItem = archiveItemRepository.findById(archiveItemId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ARCHIVE));

        archiveItemRepository.delete(archiveItem); // 실제 삭제
        log.info("자료가 삭제되었습니다. id: {}", archiveItemId);
    }
}
