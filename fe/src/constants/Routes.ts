/**
 * 앱 내 라우트 경로 상수 정의
 */

// 메인 라우트
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",

  // 사용자 관련 라우트
  PROFILE: "/user/profile",
  TEAMS: "/user/teams",
  ATTENDANCE: "/user/attendance",

  // 채팅 관련 라우트
  CHAT_GROUP: "/group",
  CHAT_DM: "/dm",
  CHAT_ARCHIVE: "/archive",

  // 예약 관련 라우트
  RESERVATION: "/reservation",
  MY_RESERVATIONS: "/reservation/my",

  // 관리자 라우트
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/panel/users",
  ADMIN_POSTS: "/admin/panel/posts",
  ADMIN_ROOMS: "/admin/panel/rooms",
  ADMIN_RESERVATIONS: "/admin/panel/reservations",
};

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  SIGNUP: "/auth/signup",

  // 예약 관련
  RESERVATIONS: "/reservations",
  USER_RESERVATIONS: "/reservations/user",
  RESERVATION_BY_ID: (id: number) => `/reservations/${id}`,

  // 방 관련
  ROOMS: "/room",
  ROOM_BY_ID: (id: number) => `/room/${id}`,

  // 관리자 관련
  ADMIN_RESERVATIONS: "/admin/reservations",
  ADMIN_RESERVATION_STATUS: (id: number) => `/admin/reservations/${id}/status`,
};
