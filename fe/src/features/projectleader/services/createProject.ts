import { apiClient } from '@/lib/api/apiClient';

export async function createProject(projectName: string): Promise<void> {
  await apiClient('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ projectName }),
  });
}
