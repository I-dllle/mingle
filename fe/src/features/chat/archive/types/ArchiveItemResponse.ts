// 서버의 ArchiveItemResponse DTO에 대응하는 프론트 타입

export interface ArchiveItemResponse {
  id: number;
  fileUrl: string;
  fileName: string;
  thumbnailUrl: string | null;
  tags: string[];
  uploaderNickname: string;
  createdAt: string; // ISO 8601 형식 문자열
}
