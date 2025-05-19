package com.example.mingle.domain.goods.entity;

import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "goods")
public class Goods extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String itemName;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "goods_images", joinColumns = @JoinColumn(name = "goods_id"))
    @Column(name = "img_url", nullable = false, length = 500)
    private List<String> imgUrl = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer itemPrice;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    //true = 판매중 , false = 품절

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy; //상품등록자

    public void update(String itemName, List<String> imgUrl, String description, Integer itemPrice, Boolean isActive){
        this.itemName = itemName;
        this.imgUrl = imgUrl;
        this.description = description;
        this.itemPrice = itemPrice;
        this.isActive = isActive;
    }

}
