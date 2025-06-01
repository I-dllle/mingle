package com.example.mingle.domain.goods.dto;

import com.example.mingle.domain.goods.entity.GoodsOrder;
import com.example.mingle.domain.goods.enums.DeliveryStatus;
import com.example.mingle.domain.goods.enums.OrderStatus;
import com.example.mingle.domain.goods.enums.PaymentMethod;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class GoodsOrderResponseDto {
    private Long id;
    private String orderId;
    private String paymentKey;
    private Integer amount;
    private Integer purAmount;
    private PaymentMethod purMethod;
    private OrderStatus purStatus;
    private DeliveryStatus purDeliveryStatus;
    private LocalDateTime orderedAt;
    private LocalDateTime paidAt;
    
    // 상품 정보
    private GoodsInfo goods;
    
    @Getter
    @Builder
    public static class GoodsInfo {
        private Long id;
        private String itemName;
        private Integer itemPrice;
        private String imgUrl;
    }

    public static GoodsOrderResponseDto fromEntity(GoodsOrder order) {
        return GoodsOrderResponseDto.builder()
                .id(order.getId())
                .orderId(order.getOrderId())
                .paymentKey(order.getPaymentKey())
                .amount(order.getAmount())
                .purAmount(order.getPurAmount())
                .purMethod(order.getPurMethod())
                .purStatus(order.getPurStatus())
                .purDeliveryStatus(order.getPurDeliveryStatus())
                .orderedAt(order.getOrderedAt())
                .paidAt(order.getPaidAt())
                .goods(GoodsInfo.builder()
                        .id(order.getGoods().getId())
                        .itemName(order.getGoods().getItemName())
                        .itemPrice(order.getGoods().getItemPrice())
                        .imgUrl(order.getGoods().getImgUrl() != null && !order.getGoods().getImgUrl().isEmpty() 
                                ? order.getGoods().getImgUrl().get(0) 
                                : null)
                        .build())
                .build();
    }
}
