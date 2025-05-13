//package com.example.mingle.domain.goods.repository;
//
//import com.example.mingle.domain.goods.entity.GoodsOrder;
//import com.example.mingle.domain.goods.enums.OrderStatus;
//import com.example.mingle.domain.goods.enums.PaymentMethod;
//import com.example.mingle.domain.user.user.entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface GoodsOrderRepository extends JpaRepository<GoodsOrder, Long> {
//    // 특정 유저의 주문 목록
//    List<GoodsOrder> findByUser(User user);
//
//    // 결제 상태별 조회
//    List<GoodsOrder> findByPurStatus(OrderStatus purStatus);
//
//    List<GoodsOrder> findByPurMethod(PaymentMethod purMethod);
//}
