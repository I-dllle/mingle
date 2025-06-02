'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const dummyActiveProjects = [
  {
    id: '1',
    name: '위클리 브이로그 시리즈 현장',
    lastMessage: '촬영 시간대 확정되면 알려주세요!',
    time: '오후 1:21',
    user: { name: 'Sahur', color: '#3B82F6', avatar: '/avatar1.png' },
  },
  {
    id: '2',
    name: '2025 정규 앨범 런칭 프로젝트',
    lastMessage: '아트워크 초안 2차 버전 첨부했어요.',
    time: '오전 11:31',
    user: { name: 'Sahur', color: '#3B82F6', avatar: '/avatar1.png' },
  },
];
const dummyCompletedProjects = [
  {
    id: '3',
    name: '해외 팬덤 타겟 광고 캠페인',
    lastMessage:
      '현지어 자막 번역 완료, 프롬프스는 간단한 현지 인사말 자막도 추가...',
    time: '어제',
    user: {
      name: 'Ballerina Cappucina',
      color: '#8B5CF6',
      avatar: '/avatar2.png',
    },
  },
];

export default function ProjectListPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const router = useRouter();

  const projects =
    tab === 'active' ? dummyActiveProjects : dummyCompletedProjects;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 0' }}>
      <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>
        Project Chat
      </h2>
      {/* 탭 */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <button
          onClick={() => setTab('active')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom:
              tab === 'active' ? '2px solid #7B61FF' : '2px solid transparent',
            color: tab === 'active' ? '#7B61FF' : '#888',
            fontWeight: tab === 'active' ? 700 : 500,
            fontSize: 16,
            padding: '8px 0',
            cursor: 'pointer',
          }}
        >
          진행중
        </button>
        <button
          onClick={() => setTab('completed')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom:
              tab === 'completed'
                ? '2px solid #7B61FF'
                : '2px solid transparent',
            color: tab === 'completed' ? '#7B61FF' : '#888',
            fontWeight: tab === 'completed' ? 700 : 500,
            fontSize: 16,
            padding: '8px 0',
            cursor: 'pointer',
          }}
        >
          완료
        </button>
      </div>
      {/* 리스트 */}
      <ul style={{ padding: 0, margin: 0 }}>
        {projects.map((project) => (
          <li
            key={project.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '18px 0',
              borderBottom: '1px solid #E5E5EF',
              cursor: 'pointer',
            }}
            onClick={() =>
              router.push(`/chat-detail/group/project/${project.id}/normal`)
            }
          >
            <img
              src={project.user.avatar}
              alt={project.user.name}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                marginRight: 16,
                objectFit: 'cover',
                border: `2px solid ${project.user.color}`,
              }}
              onError={(e) =>
                (e.currentTarget.src = 'https://placehold.co/36x36')
              }
            />
            <div style={{ flex: 1 }}>
              <div>
                <span
                  style={{
                    color: project.user.color,
                    fontWeight: 700,
                    marginRight: 6,
                  }}
                >
                  {project.user.name}
                </span>
                <span style={{ fontWeight: 700 }}>{project.name}</span>
              </div>
              <div
                style={{
                  color: '#555',
                  fontSize: 15,
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 420,
                }}
              >
                {project.lastMessage}
              </div>
            </div>
            <div
              style={{
                color: '#888',
                fontSize: 13,
                marginLeft: 16,
                minWidth: 60,
                textAlign: 'right',
              }}
            >
              {project.time}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
