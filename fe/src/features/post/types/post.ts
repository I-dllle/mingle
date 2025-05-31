export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  tags?: string[];
}

// 백엔드 PostResponseDto에 대응하는 인터페이스
export interface PostResponseDto {
  postId: number;
  deptId: number;
  departmentName: string;
  businessDocumentCategory?: BusinessDocumentCategory;
  noticeType?: NoticeType;
  postMenuName: string;
  postMenuId: number;
  postMenuCode: string;
  userId: number;
  writerName: string;
  title: string;
  content: string;
  imageUrl: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 비즈니스 문서 카테고리 enum
export enum BusinessDocumentCategory {
  MEETING_MINUTES = "MEETING_MINUTES", // 회의록
  RESOURCE = "RESOURCE", // 업무문서(업무보고서, 결재보고서, 업무요청)
}

// 공지사항 타입 enum
export enum NoticeType {
  GENERAL_NOTICE = "GENERAL_NOTICE", // 전체 공지: 관리자만 작성 가능
  DEPARTMENT_NOTICE = "DEPARTMENT_NOTICE", // 부서별 공지: 관리자 또는 해당 부서 소속 사용자
  COMPANY_NEWS = "COMPANY_NEWS", // 회사 소식: 관리자만 작성 가능
}

// 백엔드 PostRequestDto에 대응하는 인터페이스
export interface PostRequestDto {
  postTypeId: number;
  businessDocumentCategory?: BusinessDocumentCategory;
  noticeType?: NoticeType;
  userId?: number; // 보통 로그인 정보에서 자동으로 처리됨
  title: string;
  content: string;
}

// 게시글 생성 DTO (PostRequestDto 기반)
export interface CreatePostDto {
  postTypeId: number;
  businessDocumentCategory?: BusinessDocumentCategory;
  noticeType?: NoticeType;
  title: string;
  content: string;
}

// 게시글 수정 DTO
export interface UpdatePostDto {
  title?: string;
  content?: string;
  businessDocumentCategory?: BusinessDocumentCategory;
  noticeType?: NoticeType;
}

// 페이지네이션 응답 타입
export interface Page<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PostEditorProps {
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
    images?: File[];
  }) => void;
}

export interface PostListProps {
  posts: Post[];
}

export interface PostSearchProps {
  posts: Post[];
  onSearch: (filteredPosts: Post[]) => void;
}
