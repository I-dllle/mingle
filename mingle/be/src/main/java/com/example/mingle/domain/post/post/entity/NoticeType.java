package com.example.mingle.domain.post.post.entity;

public enum NoticeType {
    GENERAL_NOTICE,     // 전체 공지: 관리자만 작성 가능
    DEPARTMENT_NOTICE,  // 부서별 공지: 관리자 또는 해당 부서 소속 사용자
    COMPANY_NEWS        // 회사 소식: 관리자만 작성 가능
}