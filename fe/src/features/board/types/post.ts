// filepath: c:\develop\project3\mingle\fe\src\features\board\types\post.ts

// BusinessDocumentCategory enum (업무자료 카테고리)
export enum BusinessDocumentCategory {
  MEETING_MINUTES = "MEETING_MINUTES", // 회의록
  RESOURCE = "RESOURCE", // 업무문서(업무보고서, 결재보고서, 업무요청)
}

// NoticeType enum (공지사항 타입)
export enum NoticeType {
  GENERAL_NOTICE = "GENERAL_NOTICE", // 전체 공지: 관리자만 작성 가능
  DEPARTMENT_NOTICE = "DEPARTMENT_NOTICE", // 부서별 공지: 관리자 또는 해당 부서 소속 사용자
  COMPANY_NEWS = "COMPANY_NEWS", // 회사 소식: 관리자만 작성 가능
}

/**
 * 부서 정보 인터페이스
 */
export interface Department {
  departmentId: number;
  departmentName: string;
}

/**
 * 게시판 메뉴 인터페이스
 * 백엔드의 PostMenu 엔티티에 대응
 */
export interface PostMenu {
  menuId: number;
  code: string; // ex : BUSINESS_DOCUMENTS
  name: string; // ex : 업무자료
  description?: string; // 설명 필요 시
  department?: Department; // 소속 부서 (null이면 공통 게시판)
}

/**
 * 게시판 타입 인터페이스
 * 백엔드의 PostType 엔티티에 대응
 */
export interface PostType {
  postTypeId: number;
  menu: PostMenu;
  department?: Department;
  creatorId?: number;
}

/**
 * 게시글 응답 DTO 인터페이스
 * 백엔드의 PostResponseDto에 대응하는 타입
 */
export interface Post {
  postId: number;

  // 게시글 분류 정보
  postType: PostType; // PostType 객체 참조

  // 작성자 정보
  userId: number;
  writerName: string;

  // 게시글 내용
  title: string;
  content: string;
  imageUrl: string[];

  // 상태 관리
  isDeleted: boolean;

  // 시간 정보
  createdAt: string; // LocalDateTime은 프론트에서 string으로 받음
  updatedAt: string;

  // 특수 필드 (필요한 경우만)
  businessDocumentCategory?: BusinessDocumentCategory;
  noticeType?: NoticeType;
}

/**
 * 게시글 요청 DTO 인터페이스
 * 백엔드의 PostRequestDto에 대응하는 타입
 */
export interface PostRequest {
  businessDocumentCategory?: BusinessDocumentCategory; // 업무자료일 때만 사용, 나머지는 null로 처리
  noticeType?: NoticeType;
  userId: number;

  title: string; // @NotBlank(message = "제목을 입력해주세요.")
  content: string; // @NotBlank(message = "내용을 입력해주세요.")
}

/**
 * 게시글 생성 요청 인터페이스
 */
export interface CreatePostParams {
  postTypeId: number; // URL 경로에 포함될 PostType ID
  requestDto: PostRequest; // Request Body에 포함될 데이터
  postImages?: File[]; // multipart/form-data로 전송될 이미지 파일
}

/**
 * 페이징 응답 인터페이스
 * 백엔드의 Page<T> 응답에 대응하는 타입
 */
export interface PageResponse<T> {
  content: T[]; // 페이지 내용
  pageable: {
    pageNumber: number; // 현재 페이지 번호 (0부터 시작)
    pageSize: number; // 페이지 크기
    sort: {
      sorted: boolean; // 정렬 여부
      unsorted: boolean; // 정렬되지 않은 여부
      empty: boolean; // 비어있는지 여부
    };
    offset: number; // 오프셋
    paged: boolean; // 페이징 여부
    unpaged: boolean; // 페이징되지 않은 여부
  };
  last: boolean; // 마지막 페이지 여부
  totalElements: number; // 전체 항목 수
  totalPages: number; // 전체 페이지 수
  size: number; // 페이지당 항목 수
  number: number; // 현재 페이지 번호
  sort: {
    sorted: boolean; // 정렬 여부
    unsorted: boolean; // 정렬되지 않은 여부
    empty: boolean; // 비어있는지 여부
  };
  first: boolean; // 첫 페이지 여부
  numberOfElements: number; // 현재 페이지의 항목 수
  empty: boolean; // 페이지가 비어있는지 여부
}
