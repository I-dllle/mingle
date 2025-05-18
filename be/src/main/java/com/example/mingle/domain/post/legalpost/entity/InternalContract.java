package com.example.mingle.domain.post.legalpost.entity;

import com.example.mingle.domain.post.legalpost.enums.RatioType;
import com.example.mingle.domain.user.user.entity.User;
import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter@Setter
@Entity
public class InternalContract extends BaseEntity {
    @ManyToOne
    private User user;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal defaultRatio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RatioType ratioType;
}
