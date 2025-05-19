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
        
        // 디버깅을 위한 로그 추가
        System.out.println("User ID: " + userId);
        System.out.println("User Role: " + user.getRole());
        System.out.println("User Role Name: " + user.getRole().name());
        
        //관리자인지 검증
        if (!"ADMIN".equals(user.getRole().name())) {
            throw new ApiException(ErrorCode.FORBIDDEN);
        }

        List<String> imgUrls = new ArrayList<>();
        for (MultipartFile file : imageFiles) {
            String uploadedUrl = awsS3Uploader.upload(file, "goods_images");
            imgUrls.add(uploadedUrl);
        }
        Goods goods = Goods.builder()
                .itemName(dto.getItemName())
                .description(dto.getDescription())
                .itemPrice(dto.getItemPrice())
                .isActive(dto.getIsActive())
                .imgUrl(imgUrls)
                .createdBy(user)
                .build();

        goodsRepository.save(goods);
        return GoodsResponseDto.fromEntity(goods);
    }

    //상품조회 with 페이징
    @Transactional(readOnly = true)
    public Page<GoodsResponseDto> getAllGoodsPageable(Pageable pageable) {
        return goodsRepository.findAll(pageable)
                .map(GoodsResponseDto::fromEntity);
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
        if (imageFiles != null && imageFiles.length > 0) {
            for (MultipartFile file : imageFiles) {
                String uploadedUrl = awsS3Uploader.upload(file, "goods_images");
                imgUrls.add(uploadedUrl);
            }
        } else {
            // 변경사항 없으면 기존 이미지 유지
            imgUrls = goods.getImgUrl();
        }
        goods.update(
                requestDto.getItemName(),
                imgUrls,
                requestDto.getDescription(),
                requestDto.getItemPrice(),
                requestDto.getIsActive()
        );

        goodsRepository.save(goods);
        return GoodsResponseDto.fromEntity(goods);
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


//주문 crud
    //상품 주문


    //주문내역 확인(+배송상태까지)


    //주문취소


//TODO : 상품검색


//TODO : 페이징처리


}
