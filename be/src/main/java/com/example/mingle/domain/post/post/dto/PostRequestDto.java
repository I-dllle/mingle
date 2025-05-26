package com.example.mingle.domain.post.post.dto;

import com.example.mingle.domain.post.post.entity.BusinessDocumentCategory;
import com.example.mingle.domain.post.post.entity.NoticeType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequestDto {
    private Long postTypeId;
    //controller나 service에서 postType의 menuType이 업무자료일때만 category필드 검중, 나머지는 null로처리
    private BusinessDocumentCategory businessDocumentCategory;
    private NoticeType noticeType;
    private Long userId;

    @NotBlank(message = "제목을 입력해주세요.")
    private String title;
    @NotBlank(message = "내용을 입력해주세요.")
    private String content;
}
