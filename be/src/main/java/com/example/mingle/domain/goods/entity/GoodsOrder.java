package com.example.mingle.domain.goods.entity;

import com.example.mingle.domain.goods.enums.DeliveryStatus;
import com.example.mingle.domain.goods.enums.OrderStatus;
import com.example.mingle.domain.goods.enums.PaymentMethod;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "goods_order")
public class GoodsOrder extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Goods goods;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod purMethod;

    @Column(nullable = false)
    private Integer purAmount; //구매수량

    @Column(nullable = false)
    private Integer amount; //총 결제금액

    @Column(nullable = false, length = 100)
    private String orderId; // 고객에게 발급할 주문 ID (!= paymentKey)

    @Column(nullable = false, length = 100)
    private String paymentKey; // 토스에서 발급한 결제영수증ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus purStatus; //구매상태 : PENDING, PAID, FAILED, CANCELED

    @Enumerated(EnumType.STRING)
    @Column
    private DeliveryStatus purDeliveryStatus;

    private LocalDateTime orderedAt; //주문시각(orderId가 생성된 시각)
    private LocalDateTime paidAt; //결제시각(토스 결제 API 호출이 성공한 후의 시각)

}
