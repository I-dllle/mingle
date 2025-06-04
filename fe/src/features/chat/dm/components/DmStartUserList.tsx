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
    <div>
      {/* <h2 style={{ fontWeight: 700, fontSize: 18 }}>DM 시작하기</h2> */}

      {/* 에러 발생 시 메시지 표시 */}
      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

      <ul style={{ marginTop: 20 }}>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            style={{ marginBottom: 8 }}
            onClick={() => createRoomAndEnter(user.id)}
          >
            <img
              src={'/default-avatar.png'}
              alt={user.nickname}
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
              style={{ minWidth: 40, minHeight: 40 }}
            />
            <span className="font-medium text-[16px] text-gray-900">
              {user.nickname}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
