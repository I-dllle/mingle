package com.example.mingle.domain.post.legalpost.dto.contract;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfflineSignRequest {
    private String signerName;  // 외부 계약 상대방 이름
    private String memo;        // 추가 메모 (날짜, 위치 등)
}
