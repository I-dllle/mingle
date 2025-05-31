// import { Notice, NoticeListResponse } from "../types/Notice";
// import axios from "axios";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// export const fetchNotices = async (
//   category: string = "all",
//   page: number = 1,
//   size: number = 10
// ): Promise<NoticeListResponse> => {
//   const response = await axios.get(`${API_BASE_URL}/api/notices`, {
//     params: {
//       category,
//       page,
//       size,
//     },
//   });
//   return response.data;
// };

// export const fetchNoticeById = async (id: number): Promise<Notice> => {
//   const response = await axios.get(`${API_BASE_URL}/api/notices/${id}`);
//   return response.data;
// };

// export const createNotice = async (
//   notice: Omit<Notice, "id" | "createdAt">
// ): Promise<Notice> => {
//   const response = await axios.post(`${API_BASE_URL}/api/notices`, notice);
//   return response.data;
// };

// export const updateNotice = async (
//   id: number,
//   notice: Partial<Notice>
// ): Promise<Notice> => {
//   const response = await axios.put(`${API_BASE_URL}/api/notices/${id}`, notice);
//   return response.data;
// };

// export const deleteNotice = async (id: number): Promise<void> => {
//   await axios.delete(`${API_BASE_URL}/api/notices/${id}`);
// };
