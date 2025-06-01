import { postService } from "./postService";
import type { PostResponseDto, NoticeType } from "../types/post";

export const boardService = {
  // 공지사항 유형별 조회
  getNoticesByType: async (
    noticeType: NoticeType,
    departmentId?: number
  ): Promise<PostResponseDto[]> => {
    return await postService.getNoticesByType(noticeType, departmentId);
  },

  // 전체 공지 조회
  getGeneralNotices: async (): Promise<PostResponseDto[]> => {
    return await postService.getNoticesByType("GENERAL_NOTICE" as NoticeType);
  },

  // 부서별 공지 조회
  getDepartmentNotices: async (
    departmentId: number
  ): Promise<PostResponseDto[]> => {
    return await postService.getNoticesByType(
      "DEPARTMENT_NOTICE" as NoticeType,
      departmentId
    );
  },

  // 회사 소식 조회
  getCompanyNews: async (): Promise<PostResponseDto[]> => {
    return await postService.getNoticesByType("COMPANY_NEWS" as NoticeType);
  },
};
