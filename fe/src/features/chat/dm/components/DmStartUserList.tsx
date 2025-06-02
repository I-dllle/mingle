'use client';

import { useEffect, useState } from 'react';
import { useCreateDmRoom } from '../services/useCreateDmRoom';
import { fetchDmCandidates } from '@/features/user/profile/services/userService'; // fetch 함수 임포트
import type { UserSimpleDto } from '@/features/user/search/types/UserSimpleDto';

export default function DmStartUserList() {
  const { createRoomAndEnter } = useCreateDmRoom();
  const [users, setUsers] = useState<UserSimpleDto[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDmCandidates()
      .then(setUsers)
      .catch(() => setError('유저 목록을 불러오는 데 실패했습니다.'));
  }, []);

  return (
    <div style={{ padding: 32 }}>
      {/* <h2 style={{ fontWeight: 700, fontSize: 18 }}>DM 시작하기</h2> */}

      {/* 에러 발생 시 메시지 표시 */}
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

      <ul style={{ marginTop: 20 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              marginBottom: 12,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 500,
              color: '#222',
            }}
            onClick={() => createRoomAndEnter(user.id)}
          >
            👉 {user.nickname}
          </li>
        ))}
      </ul>
    </div>
  );
}
