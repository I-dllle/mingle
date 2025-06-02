'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/features/projectleader/services/createProject';

export default function ProjectCreatePage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');

  // 프로젝트 생성 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName) {
      alert('프로젝트 이름은 필수입니다.');
      return;
    }

    try {
      await createProject(projectName); // 프로젝트 생성 함수 호출
      alert('프로젝트가 등록되었습니다!');
      router.push('/group'); // 또는 프로젝트 목록으로 이동
    } catch (err) {
      console.error(err);
      alert('프로젝트 등록에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2>프로젝트 생성</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        <label>
          프로젝트 이름
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </label>

        <label>
          프로젝트 종료일 (선택)
          <input
            type="date"
            value={projectEndDate}
            onChange={(e) => setProjectEndDate(e.target.value)}
          />
        </label>

        <button type="submit" style={{ marginTop: '16px' }}>
          프로젝트 등록
        </button>
      </form>
    </div>
  );
}
