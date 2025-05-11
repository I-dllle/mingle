package com.example.mingle.domain.goods.entity;

import com.example.mingle.domain.goods.enums.OrderStatus;
import com.example.mingle.domain.goods.enums.PaymentMethod;
import com.example.mingle.domain.user.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoodsOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Goods goods;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer purAmount;

    @Column(nullable = false)
    private Integer priceTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus purStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod purMethod;

    @Column(nullable = false, length = 100)
    private String transactionId;

    @Column(nullable = false)
    private LocalDateTime orderedAt;

    private LocalDateTime paidAt;

    private Long purchaseId;

    private LocalDateTime purchasedAt;
}
