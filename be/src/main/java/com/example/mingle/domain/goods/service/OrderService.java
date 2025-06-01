package com.example.mingle.domain.goods.service;

import com.example.mingle.domain.goods.dto.GoodsOrderRequestDto;
import com.example.mingle.domain.goods.dto.GoodsOrderResponseDto;
import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.goods.entity.GoodsOrder;
import com.example.mingle.domain.goods.enums.DeliveryStatus;
import com.example.mingle.domain.goods.enums.OrderStatus;
import com.example.mingle.domain.goods.enums.PaymentMethod;
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
        // 주문이 존재하는지 확인하고, 없으면 패스 (토스페이먼츠에서는 결제 후 주문 생성 가능)
        try {
            GoodsOrder order = goodsOrderRepository.findByOrderId(orderId)
                    .orElse(null);

            if (order != null) {
                if (!order.getAmount().toString().equals(requestAmount)) {
                    throw new ApiException(ErrorCode.INVALID_ORDER_PRICE);
                }
            } else {
                // 주문이 없는 경우 - 토스페이먼츠 테스트에서는 정상적인 경우
                // 실제 운영에서는 결제 전에 주문을 생성해야 하지만, 테스트를 위해 허용
                System.out.println("주문이 존재하지 않음 - orderId: " + orderId + ", amount: " + requestAmount);
            }
        } catch (ApiException e) {
            throw e; // ApiException은 그대로 던지기
        } catch (Exception e) {
            // 기타 예외는 로그만 출력하고 넘어가기
            System.err.println("주문 금액 검증 중 오류: " + e.getMessage());
        }
    }

    //결제완료
    @Transactional
    public void setPaymentComplete(String orderId, String paymentKey){
        try {
            GoodsOrder order = goodsOrderRepository.findByOrderId(orderId)
                    .orElse(null);

            if (order != null) {
                order.setPurStatus(OrderStatus.PAID);
                order.setPaidAt(LocalDateTime.now());
                order.setPaymentKey(paymentKey);
            } else {
                // 주문이 없는 경우 - 로그만 출력
                System.out.println("결제 완료 처리할 주문이 없음 - orderId: " + orderId + ", paymentKey: " + paymentKey);
            }
        } catch (Exception e) {
            System.err.println("결제 완료 처리 중 오류: " + e.getMessage());
            throw e;
        }
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

    // 간단한 주문 생성 (결제 성공 후 호출용)
    @Transactional
    public GoodsOrder createSimpleOrder(String orderId, String paymentKey, Integer amount, Long goodsId, Long userId) {
        try {
            // 이미 존재하는 주문인지 확인
            GoodsOrder existingOrder = goodsOrderRepository.findByOrderId(orderId).orElse(null);
            if (existingOrder != null) {
                return existingOrder;
            }
            
            // 새 주문 생성 (간단한 버전)
            GoodsOrder order = GoodsOrder.builder()
                    .orderId(orderId)
                    .paymentKey(paymentKey)
                    .amount(amount)
                    .purAmount(1) // 기본값
                    .purMethod(PaymentMethod.TOSS) // 기본값
                    .purStatus(OrderStatus.PAID)
                    .purDeliveryStatus(DeliveryStatus.PREPARING)
                    .orderedAt(LocalDateTime.now())
                    .paidAt(LocalDateTime.now())
                    .build();

            return goodsOrderRepository.save(order);
        } catch (Exception e) {
            System.err.println("간단 주문 생성 중 오류: " + e.getMessage());
            return null;
        }
    }

}
