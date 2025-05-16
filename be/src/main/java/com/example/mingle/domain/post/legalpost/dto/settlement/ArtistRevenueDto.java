package com.example.mingle.domain.post.legalpost.dto.settlement;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ArtistRevenueDto {
    private Long artistId;
    private String artistName;
    private BigDecimal totalRevenue;
}
