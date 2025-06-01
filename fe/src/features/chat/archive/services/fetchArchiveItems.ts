// 자료 메시지 목록 조회 API
import { apiClient } from '@/lib/api/apiClient';
import { ArchiveItem } from '@/features/chat/archive/types/ArchiveItem';

export async function fetchArchiveItems(
  roomId: number
): Promise<ArchiveItem[]> {
  try {
    const res = await apiClient<ArchiveItem[]>(`/api/v1/archive/${roomId}`);
    return res;
  } catch (err) {
    console.error('📂 자료 불러오기 실패:', err);
    return [];
  }
}
