/**
 * 게시판 메뉴 상수 정의
 */

// 공통 게시판 코드
export const COMMON_POST_MENU = {
  NOTICE: "NOTICE", // 공지사항
  AUDITION: "AUDITION", // 오디션공고
};

// 부서별 게시판 코드
export const DEPARTMENT_POST_MENU = {
  BUSINESS_DOCUMENTS: "BUSINESS_DOCUMENTS", // 업무자료
  DEPARTMENT_BOARD: "DEPARTMENT_BOARD", // 부서 게시판
};

// 메뉴 ID (예시, 실제 값은 백엔드 데이터에 따라 달라질 수 있음)
export const POST_MENU_ID = {
  NOTICE: 1,
  AUDITION: 3,
  BUSINESS_DOCUMENTS: 2,
};
