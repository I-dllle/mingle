package com.example.mingle.domain.chat.archive.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ArchiveTagUpdateRequest {

    @NotNull
    private List<String> tags; // 새로 업데이트할 태그 리스트
}
