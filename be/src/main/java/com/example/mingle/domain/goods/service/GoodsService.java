package com.example.mingle.domain.goods.service;

import com.example.mingle.domain.goods.dto.GoodsRequestDto;
import com.example.mingle.domain.goods.dto.GoodsResponseDto;
import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.goods.repository.GoodsRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.domain.user.user.entity.UserRole;
import com.example.mingle.domain.user.user.repository.UserRepository;
import com.example.mingle.global.aws.AwsS3Uploader;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoodsService {
    private final GoodsRepository goodsRepository;
    private final AwsS3Uploader awsS3Uploader;
    private final UserRepository userRepository;

    //굿즈 crud
    //관리자가 상품 등록
    @Transactional
    public GoodsResponseDto registerGoods(Long userId, GoodsRequestDto dto, MultipartFile[] imageFiles) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        
        //관리자인지 검증
        if (!"ADMIN".equals(user.getRole().name())) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }

        List<String> imgUrls = new ArrayList<>();
        if (imageFiles != null) {
            for (MultipartFile file : imageFiles) {
                if (file != null && !file.isEmpty()) {
                    String uploadedUrl = awsS3Uploader.upload(file, "goods_images");
                    imgUrls.add(uploadedUrl);
                }
            }
        }

        Goods goods = Goods.builder()
                .itemName(dto.getItemName())
                .description(dto.getDescription())
                .itemPrice(dto.getItemPrice())
                .isActive(dto.getIsActive())
                .imgUrl(imgUrls)
                .createdBy(user)
                .build();

        Goods savedGoods = goodsRepository.save(goods);
        
        return GoodsResponseDto.fromEntity(savedGoods);
    }

    //상품조회 with 페이징
    @Transactional(readOnly = true)
    public Page<GoodsResponseDto> getAllGoodsPageable(int page, int size, String sortField, Sort.Direction direction, String search) {
        Sort sort = Sort.by(direction, sortField);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Goods> goodsPage;
        if (search != null && !search.trim().isEmpty()) {
            // 검색어가 있으면 상품명으로 검색
            goodsPage = goodsRepository.findByItemNameContainingIgnoreCase(search.trim(), pageable);
        } else {
            // 검색어가 없으면 전체 조회
            goodsPage = goodsRepository.findAll(pageable);
        }

        return goodsPage.map(GoodsResponseDto::fromEntity);
    }


    //관리자가 상품내용 수정
    @Transactional
    public GoodsResponseDto modifyGoods(Long goodsId, Long userId, GoodsRequestDto requestDto, MultipartFile[] imageFiles) throws IOException {
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        // 관리자만 수정 가능
        if (!"ADMIN".equals(user.getRole().name())) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }

        List<String> imgUrls = new ArrayList<>();
        
        // 새로운 이미지 파일이 있으면 업로드
        if (imageFiles != null && imageFiles.length > 0) {
            for (MultipartFile file : imageFiles) {
                if (file != null && !file.isEmpty()) {
                    String uploadedUrl = awsS3Uploader.upload(file, "goods_images");
                    imgUrls.add(uploadedUrl);
                }
            }
        } else {
            // 새로운 이미지가 없으면 기존 이미지 유지
            imgUrls = new ArrayList<>(goods.getImgUrl());
        }
        
        goods.update(
                requestDto.getItemName(),
                imgUrls,
                requestDto.getDescription(),
                requestDto.getItemPrice(),
                requestDto.getIsActive()
        );

        // 명시적으로 저장하여 @ElementCollection 변경사항 반영
        Goods savedGoods = goodsRepository.save(goods);
        
        return GoodsResponseDto.fromEntity(savedGoods);
    }

    //관리자가 상품 삭제
    @Transactional
    public void deleteGoods(Long goodsId, Long userId){
        Goods goods = goodsRepository.findById(goodsId)
                .orElseThrow (() -> new ApiException(ErrorCode.GOODS_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        //관리자만 삭제 가능
        if (!"ADMIN".equals(user.getRole().name())) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }

        goodsRepository.delete(goods);
    }

//TODO : 상품검색


//TODO : 페이징처리


}
