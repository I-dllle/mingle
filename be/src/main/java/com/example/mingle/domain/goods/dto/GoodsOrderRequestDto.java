package com.example.mingle.domain.goods.dto;

import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.goods.enums.PaymentMethod;
import com.example.mingle.domain.user.user.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoodsOrderRequestDto {
    //상품 주문시 필요한 정보
    private Goods goods;
    private String orderId;
    private Integer purAmount;
    private Integer amount;
    private PaymentMethod purMethod;
}
