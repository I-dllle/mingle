package com.example.mingle.domain.goods.repository;

import com.example.mingle.domain.goods.entity.Goods;
import com.example.mingle.domain.user.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, Long> {
    // 상품명으로 검색
    List<Goods> findByItemNameContaining(String keyword);

    // 판매중인 상품만 조회
    List<Goods> findByIsActiveTrue();

    // 특정 사용자가 등록한 상품
    List<Goods> findByCreatedBy(User user);
}
