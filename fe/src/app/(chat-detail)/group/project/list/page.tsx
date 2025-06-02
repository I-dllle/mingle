'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const dummyActiveProjects = [
  {
    id: '1',
    name: '위클리 브이로그 시리즈 현장',
    lastMessage: '촬영 시간대 확정되면 알려주세요!',
    time: '오후 1:21',
  },
  {
    id: '2',
    name: '2025 정규 앨범 런칭 프로젝트',
    lastMessage: '아트워크 초안 2차 버전 첨부했어요.',
    time: '오전 11:31',
  },
];
const dummyCompletedProjects = [
  {
    id: '3',
    name: '해외 팬덤 타겟 광고 캠페인',
    lastMessage: '현지어 자막 번역 완료, 프롬프스 추가...',
    time: '어제',
  },
];

export default function ProjectListPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const router = useRouter();

  const projects =
    tab === 'active' ? dummyActiveProjects : dummyCompletedProjects;

  return (
    <div style={{ padding: 32 }}>
      <h2>Project Chat</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setTab('active')}
          style={{ fontWeight: tab === 'active' ? 'bold' : 'normal' }}
        >
          진행중
        </button>
        <button
          onClick={() => setTab('completed')}
          style={{ fontWeight: tab === 'completed' ? 'bold' : 'normal' }}
        >
          완료
        </button>
      </div>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{ cursor: 'pointer', marginBottom: 16 }}
            onClick={() =>
              router.push(`/chat-detail/group/project/${project.id}/normal`)
            }
          >
            <div style={{ fontWeight: 'bold' }}>{project.name}</div>
            <div style={{ color: '#888' }}>{project.lastMessage}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{project.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
