// 자료방에서 사용하는 파일 항목 타입

import { ArchiveTag } from './ArchiveTag'; // 자료에 연결된 태그 타입

export interface ArchiveItem {
  id: number; // 자료 ID
  originalFilename: string; // 사용자가 업로드한 원래 파일 이름
  storedFilename: string; // 서버에 저장된 파일 이름 (S3 key 등)
  url: string; // 다운로드/미리보기 가능한 URL
  createdAt: string; // 업로드 시각 (ISO 8601 문자열)
  uploaderNickname: string; // 업로드한 사용자 닉네임
  tags: ArchiveTag[]; // 연결된 태그 목록
}
