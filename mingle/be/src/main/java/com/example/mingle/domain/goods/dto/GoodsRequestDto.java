package com.example.mingle.domain.goods.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoodsRequestDto {
    //상품 등록시 요구되는 정보
    @NotBlank(message = "상품명은 필수 입력 항목입니다.")
    private String itemName;
    
    @NotNull(message = "상품 가격은 필수 입력 항목입니다.")
    private Integer itemPrice;
    
    @NotNull(message = "상품 상태는 필수 입력 항목입니다.")
    private Boolean isActive;

    private String description;
}
