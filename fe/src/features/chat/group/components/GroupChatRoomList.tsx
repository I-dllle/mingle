'use client';

import { useRouter } from 'next/navigation';
import { useGroupChatRoomList } from '@/features/chat/group/services/useGroupChatRoomList';
import { GroupChatRoomSummary } from '@/features/chat/group/types/GroupChatRoomSummary';
import { ChatScope } from '@/features/chat/common/types/ChatScope';
import Link from 'next/link';
import { useAuth } from '@/features/user/auth/AuthProvider'; // 유저 정보 사용
import { DepartmentRole, ProjectRole } from '@/features/user/auth/types/roles';

// props 타입 선언
type Props = {
  projectStatus: 'active' | 'completed';
};

// 그룹 채팅방 목록을 보여주는 UI 컴포넌트
// - 서버에서 요약 목록 데이터를 받아와 리스트로 출력
export default function GroupChatRoomList({ projectStatus }: Props) {
  // scope를 PROJECT로 고정
  const scope = ChatScope.PROJECT;
  const { rooms } = useGroupChatRoomList({ scope });
  // 유저 정보 불러오기
  const { user } = useAuth();
  // 라우터 사용
  const router = useRouter();

  // 채팅방 생성 권한 있는지 판단
  const canCreateRoom =
    user?.role === 'ADMIN' ||
    user?.departmentRole === DepartmentRole.TEAM_LEAD ||
    user?.projectRole === ProjectRole.PROJECT_LEADER;

  // 상태별로 채팅방 필터링
  const filteredRooms = rooms.filter((room) =>
    projectStatus === 'active' ? !room.completed : room.completed
  );

  return (
    <div style={{ padding: '16px' }}>
      <h2>그룹 채팅방 목록</h2>

      {/* 생성 버튼 - 권한 있는 사용자만 보임 */}
      {canCreateRoom && (
        <div style={{ marginBottom: '12px' }}>
          <button
            style={{
              padding: '8px 14px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            // 채팅방 생성 페이지로 이동
            onClick={() => router.push('/group/create')}
          >
            + 채팅방 생성
          </button>
        </div>
      )}

      {/* 필터링된 채팅방 기준으로 렌더링 */}
      {filteredRooms.length === 0 ? (
        <div>채팅방이 없습니다.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {/* 채팅방 목록 map으로 반복 출력 */}
          {filteredRooms.map((room: GroupChatRoomSummary) => (
            <li
              key={room.roomId}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
              }}
            >
              {/* 채팅방 링크 클릭 시 상세 페이지로 이동 */}
              <Link href={`/group/${room.roomId}`}>
                <div style={{ fontWeight: 'bold' }}>{room.name}</div>

                {/* 메시지 형식이 ARCHIVE면 [자료] 라벨 붙이기 */}
                <div>
                  {room.format === 'ARCHIVE' ? '[자료]' : room.previewMessage}
                </div>

                {/* 메시지 전송 시각과 안읽은 메시지 개수 표시(시간 포맷팅 적용) */}
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {formatTime(room.sentAt)} / {room.unreadCount}개 안읽음
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 시간 포맷팅 함수 (오전/오후 HH:MM 형태)
function formatTime(isoTime: string | null): string {
  if (!isoTime) return '시간 없음';
  const date = new Date(isoTime);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const isAM = hours < 12;
  const displayHour = hours % 12 || 12;
  return `${isAM ? '오전' : '오후'} ${displayHour}:${minutes}`;
}
