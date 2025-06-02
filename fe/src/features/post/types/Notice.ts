export type NoticeCategory = "all" | "department" | "company_news";

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: NoticeCategory;
  department?: string; // 부서별 공지인 경우에만
  author: string;
  createdAt: string;
  isImportant: boolean;
}

export interface NoticeListResponse {
  notices: Notice[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
