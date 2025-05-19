package com.example.mingle.domain.chat.archive.entity;

import com.example.mingle.global.jpa.BaseEntity;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.List;

@Entity
public class ArchiveItem extends BaseEntity {

    @Id @GeneratedValue
    private Long id;

    private Long chatRoomId;   // 어떤 자료방에 속해 있는지

    private Long uploaderId;

    private String fileUrl;    // S3 주소 등

    private String fileName;

    private String thumbnailUrl;  // 미리보기 이미지, 선택

    @ElementCollection
    private List<String> tags;    // #태그 리스트

    // 추후: 파일 타입, 사이즈, 다운로드 횟수 등도 확장 가능
}

