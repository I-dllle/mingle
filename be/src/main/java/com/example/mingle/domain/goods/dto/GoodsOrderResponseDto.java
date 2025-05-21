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
    //주문내역
    private String orderId;
    private String itemName;
    private Integer amount;
    private Integer purAmount;
    private PaymentMethod purMethod;
    private OrderStatus purStatus;
    private DeliveryStatus purDeliveryStatus;
    private LocalDateTime orderedAt;
    private LocalDateTime paidAt;

    public static GoodsOrderResponseDto fromEntity(GoodsOrder order) {
        return GoodsOrderResponseDto.builder()
                .orderId(order.getOrderId())
                .itemName(order.getGoods().getItemName()) // getName()은 Goods에 있다고 가정
                .amount(order.getAmount())
                .purAmount(order.getPurAmount())
                .purMethod(order.getPurMethod())
                .purStatus(order.getPurStatus())
                .purDeliveryStatus(order.getPurDeliveryStatus())
                .orderedAt(order.getOrderedAt())
                .paidAt(order.getPaidAt())
                .build();
    }
}
