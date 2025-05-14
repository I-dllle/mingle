//package com.example.mingle.domain.goods.entity;
//
//import com.example.mingle.domain.user.user.entity.User;
//import com.example.mingle.global.jpa.BaseEntity;
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Getter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class Goods extends BaseEntity {
//    @Column(nullable = false, length = 100)
//    private String itemName;
//
//    @Column(nullable = false, length = 500)
//    private String imgUrl;
//
//    @Column(columnDefinition = "TEXT")
//    private String imgDescription;
//
//    @Column(nullable = false)
//    private Integer itemPrice;
//
//    @Column(nullable = false)
//    private Boolean isActive;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "created_by", nullable = false)
//    private User createdBy;
//}
