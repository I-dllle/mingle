package com.example.mingle.domain.goods.dto;

import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.user.user.entity.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsResponseDto {
    //상품 조회시 필요한 정보
    private String itemName;
    private List<String> imgUrl;
    private String description;
    private Integer itemPrice;
    private Boolean isActive;

    //관리자용 필드
    private User createdBy;

    public static GoodsResponseDto fromEntity(Goods goods) {
        return GoodsResponseDto.builder()
                .itemName(goods.getItemName())
                .imgUrl(goods.getImgUrl())
                .description(goods.getDescription())
                .itemPrice(goods.getItemPrice())
                .isActive(goods.getIsActive())
                .createdBy(goods.getCreatedBy())
                .build();
    }
}
