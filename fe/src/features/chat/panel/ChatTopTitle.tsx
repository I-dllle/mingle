'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMyTeamRoomId } from '@/features/user/auth/hooks/useMyTeamRoomId'; // 예시: 유저 팀 roomId를 가져오는 커스텀 훅

export default function ChatTopTitle() {
  const pathname = usePathname();
  const router = useRouter();
  const myTeamRoomId = useMyTeamRoomId(); // 실제 유저의 팀 채팅방 id

  const chatRoutes = [
    { label: 'Project Chat', path: '/group/project/list' },
    { label: 'DM', path: '/dm' },
    { label: 'TeamChat', path: `/group/team/${myTeamRoomId}/normal` },
  ];

  // 현재 경로가 어느 타입인지 찾기
  const currentIdx = chatRoutes.findIndex(
    (route) => pathname.startsWith(route.path.replace('[teamId]', '')) // [teamId]는 실제 값으로 비교 필요
  );

  // 다음 경로 계산
  const nextIdx = (currentIdx + 1) % chatRoutes.length;
  const nextRoute = chatRoutes[nextIdx];

  // 더블클릭 핸들러
  const handleDoubleClick = () => {
    // [teamId]는 실제 유저의 팀 ID로 치환 필요
    let nextPath = nextRoute.path;
    if (nextPath.includes('[teamId]')) {
      nextPath = nextPath.replace('[teamId]', '1'); // 예시: 실제 팀 ID로 치환
    }
    router.push(nextPath);
  };

  // 현재 라벨 표시
  const label = chatRoutes[currentIdx >= 0 ? currentIdx : 0].label;

  return (
    <span
      style={{
        fontWeight: 700,
        fontSize: 22,
        lineHeight: '1.2',
        margin: 0,
        cursor: 'pointer',
        userSelect: 'none',
        color: '#222', // 필요시 색상 조정
        marginBottom: 24,
        fontFamily: 'Alkatra',
        // 기타 ChatPanelLayout 상단 타이틀과 동일하게
      }}
      onDoubleClick={handleDoubleClick}
      title="더블클릭 시 채팅 타입 전환"
    >
      {label}
    </span>
  );
}
