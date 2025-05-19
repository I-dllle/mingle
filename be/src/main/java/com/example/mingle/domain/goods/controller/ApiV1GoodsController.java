package com.example.mingle.domain.goods.controller;

import com.example.mingle.domain.goods.dto.GoodsRequestDto;
import com.example.mingle.domain.goods.dto.GoodsResponseDto;
import com.example.mingle.domain.goods.service.GoodsService;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.security.auth.SecurityUser;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

@RestController
@RequestMapping("api/v1/goods")
@RequiredArgsConstructor
@Tag(name = "Goods", description = "상점 관련 API")
public class ApiV1GoodsController {
    private final GoodsService goodsService;

    // 상품 조회 (페이지 단위)
    @Operation(
            summary = "상품 목록 조회",
            description = "모든 상품을 조회합니다.",
            responses = {
                @ApiResponse(responseCode = "200", description = "조회 성공")
            }
    )
    @GetMapping
    public ResponseEntity<Page<GoodsResponseDto>> getAllGoods(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<GoodsResponseDto> goods = goodsService.getAllGoodsPageable(pageable);
        return ResponseEntity.ok(goods);
    }

    // 상품 등록 (관리자만)
    @Operation(
            summary = "상품 등록",
            description = "상품을 등록합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "등록 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청 (내용 누락 등)"),
                    @ApiResponse(responseCode = "403", description = "권한이 없는 사용자")
            }
    )
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<GoodsResponseDto> registerGoods(
            @RequestPart(value = "dto", required = true) @Valid GoodsRequestDto dto,
            @RequestPart(value = "imgUrl", required = false) MultipartFile[] imageFiles,
            @Parameter(description = "사용자 ID", required = true) @AuthenticationPrincipal SecurityUser user
    ) throws IOException {
        GoodsResponseDto responseDto = goodsService.registerGoods(user.getId(), dto, imageFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    // 상품 수정 (관리자만)
    @Operation(
            summary = "상품 수정",
            description = "특정 상품의 세부사항을 수정합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "수정 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청 (내용 누락 등)"),
                    @ApiResponse(responseCode = "403", description = "권한이 없는 사용자"),
                    @ApiResponse(responseCode = "404", description = "해당 상품 없음")
            }
    )
    @PutMapping(value = "/{goodsId}", consumes = "multipart/form-data")
    public ResponseEntity<GoodsResponseDto> modifyGoods(
            @PathVariable Long goodsId,
            @RequestPart(value = "dto", required = true) @Valid GoodsRequestDto dto,
            @RequestPart(value = "imgUrl", required = false) MultipartFile[] imageFiles,
            @Parameter(description = "인증된 사용자 정보", required = true)
            @AuthenticationPrincipal SecurityUser user
    ) throws IOException {
        GoodsResponseDto updatedDto = goodsService.modifyGoods(goodsId, user.getId(), dto, imageFiles);
        return ResponseEntity.ok(updatedDto);
    }

    // 상품 삭제 (관리자만)
    @Operation(
            summary = "상품 삭제",
            description = "특정 상품을 삭제합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "삭제 성공"),
                    @ApiResponse(responseCode = "403", description = "권한이 없는 사용자"),
                    @ApiResponse(responseCode = "404", description = "해당 상품 없음")
            }
    )
    @DeleteMapping("/{goodsId}")
    public ResponseEntity<Void> deleteGoods(
            @PathVariable Long goodsId,
            @Parameter(description = "인증된 사용자 정보", required = true)
            @AuthenticationPrincipal SecurityUser user
    ) {
        goodsService.deleteGoods(goodsId, user.getId());
        return ResponseEntity.noContent().build();
    }

    //상품검색


    //상품주문


    //상품결제


    //결제취소


    //결제리스트


    //결제내역 상세보기(주문서조회)


}
