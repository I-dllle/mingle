// lib/apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 자동 포함
});

// 요청 인터셉터 - 모든 요청에 공통적으로 적용할 처리
apiClient.interceptors.request.use(
  (config) => {
    // Electron 환경일 경우 특수 처리
    if (process.env.NEXT_PUBLIC_ENV === "electron") {
      // Electron에서 필요한 특수 헤더나 설정을 추가할 수 있음
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 모든 응답에 공통적으로 적용할 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 에러 처리 로직
    if (error.response) {
      // 서버 응답 에러 (4xx, 5xx 상태 코드)
      const status = error.response.status;

      // 인증 에러 처리
      if (status === 401) {
        // 로그아웃 또는 세션 만료 처리
        if (typeof window !== "undefined") {
          // 브라우저 환경일 때만 리다이렉트
          window.location.href = "/login";
        }
      }

      // 권한 에러
      if (status === 403) {
        console.error("접근 권한이 없습니다.");
      }
    } else if (error.request) {
      // 요청은 보냈으나 응답을 받지 못함 (네트워크 에러 등)
      console.error("네트워크 연결에 문제가 있습니다.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
