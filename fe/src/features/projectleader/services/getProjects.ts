import { apiClient } from '@/lib/api/apiClient';

import { ProjectResponse } from '../types/project'; // 타입 따로 정의할 거야

export async function getProjects(): Promise<ProjectResponse[]> {
  try {
    return await apiClient<ProjectResponse[]>('/api/v1/projects');
  } catch (error) {
    console.error('프로젝트 목록 조회 실패:', error);
    throw error;
  }
}
