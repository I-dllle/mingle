package com.example.mingle.domain.goods.service;

import com.example.mingle.domain.goods.dto.GoodsOrderRequestDto;
import com.example.mingle.domain.goods.dto.GoodsOrderResponseDto;
import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.goods.entity.GoodsOrder;
import com.example.mingle.domain.goods.enums.DeliveryStatus;
import com.example.mingle.domain.goods.enums.OrderStatus;
import com.example.mingle.domain.goods.repository.GoodsOrderRepository;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.exception.ApiException;
import com.example.mingle.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final GoodsOrderRepository goodsOrderRepository;

    //상품 주문(배송상태 : default=배송준비중)
    @Transactional
    public GoodsOrderResponseDto createOrder(GoodsOrderRequestDto requestDto, User user, Goods goods){
        GoodsOrder order = GoodsOrder.builder()
                .goods(goods)
                .user(user)
                .purMethod(requestDto.getPurMethod())
                .purAmount(requestDto.getPurAmount())
                .amount(requestDto.getAmount())
                .orderId(requestDto.getOrderId()) // 프론트에서 생성된 고유 주문 ID
                .paymentKey("") // 토스에서 발급한 결제영수증 ID
                .purStatus(OrderStatus.PENDING)
                .purDeliveryStatus(DeliveryStatus.PREPARING)
                .orderedAt(LocalDateTime.now())
                .build();

        goodsOrderRepository.save(order);
        return GoodsOrderResponseDto.fromEntity(order);
    }

    //해당 주문번호의 최종 결제금액이 amount와 일치하는지 확인(최종결제 전 백엔드에서 한번 더 검증)
    public void checkAmount(String orderId, String requestAmount){
        GoodsOrder order = goodsOrderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_ORDER_NOT_FOUND));

        if (!order.getAmount().toString().equals(requestAmount)) {
            throw new ApiException(ErrorCode.INVALID_ORDER_PRICE);
        }

        //일치하지 않는다면 롤백



    }

    //결제완료
    @Transactional
    public void setPaymentComplete(String orderId, String paymentKey){
        GoodsOrder order = goodsOrderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_ORDER_NOT_FOUND));

        order.setPurStatus(OrderStatus.PAID);
        order.setPaidAt(LocalDateTime.now());
        order.setPaymentKey(paymentKey);
    }
    
    //TODO : 주문내역 확인(+배송상태 반영)
    @Transactional(readOnly = true)
    public List<GoodsOrderResponseDto> getOrdersByUser(User user) {
        return goodsOrderRepository.findByUser(user)
                .stream()
                .map(GoodsOrderResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    //주문취소
    //TODO : 실제 결제 취소 로직 작성(현재는 status변경만 해둔 상태)
    @Transactional
    public void cancelOrder(String orderId){
        //주문취소 로직
        GoodsOrder order = goodsOrderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ApiException(ErrorCode.GOODS_ORDER_NOT_FOUND));

        if (order.getPurStatus() == OrderStatus.CANCELED || order.getPurDeliveryStatus() != DeliveryStatus.PREPARING) {
            throw new ApiException(ErrorCode.CANCEL_ORDER_CONFLICT);
        }

        order.setPurStatus(OrderStatus.CANCELED);
    }

}
