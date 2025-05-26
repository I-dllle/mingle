import axios from "axios";

// API 클라이언트 설정
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 Authorization 헤더에 추가
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 시 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
