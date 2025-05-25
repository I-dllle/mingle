import axios from "axios";

// 환경에 따라 다른 baseURL 설정
const getBaseUrl = () => {
  // Electron 환경일 때
  if (process.env.NEXT_PUBLIC_ENV === "electron") {
    return "http://localhost:3000/api"; // Electron 내 로컬 서버 또는 다른 주소
  }
  // 웹 환경일 때
  return "/api"; // 상대 경로로 API 요청
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 전송 설정 (필요시)
});

// 요청 인터셉터 (토큰 추가 등 가능)
apiClient.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 토큰 가져오기 (필요시)
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    if (error.response?.status === 401) {
      // 인증 에러 처리 (로그아웃 등)
      if (typeof window !== "undefined") {
        // 로그아웃 처리
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
