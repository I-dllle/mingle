package com.example.mingle.domain.goods.enums;

public enum OrderStatus {
    PENDING, //주문 완료, 결제 대기중
    PAID, //결제 완료
    FAILED, //결제 실패
    CANCELED //주문 취소
}
