package com.example.mingle.domain.admin.panel.controller;



import com.example.mingle.domain.post.post.dto.PostRequestDto;
import com.example.mingle.domain.post.post.dto.PostResponseDto;
import com.example.mingle.domain.post.post.service.PostService;
import com.example.mingle.global.security.auth.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;

import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/posts")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "AdminPost", description = "관리자 전용 게시글 관리 API")
public class ApiV1AdminPostController {

    private final PostService postService;

    @Operation(summary = "공지사항 생성", description = "NoticeType이 공지사항인 게시글을 작성합니다.")
    @PostMapping(value = "/notices", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> createNotice(
            @RequestPart @Valid PostRequestDto requestDto,
            @RequestPart(required = false) MultipartFile[] postImage,
            @AuthenticationPrincipal SecurityUser user
    ) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(requestDto.getPostTypeId(), user.getId(), requestDto, postImage));
    }

    @Operation(summary = "전체 공지사항 조회", description = "부서가 없는 글로벌 공지사항을 조회합니다.")
    @GetMapping("/notices/global")
    public ResponseEntity<List<PostResponseDto>> getGlobalNotices() {
        return ResponseEntity.ok(postService.getGlobalNotices());
    }

    @Operation(summary = "부서 공지사항 조회", description = "부서 ID를 통해 부서 공지사항을 조회합니다.")
    @GetMapping("/notices/department")
    public ResponseEntity<List<PostResponseDto>> getDepartmentNotices(@RequestParam Long departmentId) {
        return ResponseEntity.ok(postService.getDepartmentNotices(departmentId));
    }

    @Operation(summary = "상세 게시글 조회", description = "게시글 ID로 상세 정보 조회")
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @Operation(summary = "게시글 수정", description = "게시글 ID로 게시글 수정")
    @PutMapping(value = "/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> updatePost(
            @PathVariable Long postId,
            @RequestPart @Valid PostRequestDto requestDto,
            @RequestPart(required = false) MultipartFile[] postImage,
            @AuthenticationPrincipal SecurityUser user
    ) throws IOException {
        return ResponseEntity.ok(postService.updatePost(postId, user.getId(), requestDto, postImage));
    }

    @Operation(summary = "게시글 삭제", description = "게시글 ID로 게시글 삭제")
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId, @RequestParam Long userId) {
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }
}
