'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSearch } from '@/features/user/search/services/useUserSearch';
import { apiClient } from '@/lib/api/apiClient';

export default function DmUserSearch() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const { results, loading, error } = useUserSearch(keyword);

  const handleStartDm = async (opponentId: number) => {
    const { roomId } = await apiClient<{ roomId: number }>('/dm-chat', {
      method: 'POST',
      body: JSON.stringify({ opponentId }),
    });
    router.push(`/dm/${roomId}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)} // 입력만으로 자동 검색
        placeholder="닉네임 검색"
      />
      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.map((user) => (
        <div key={user.id}>
          <span>
            {user.nickname} ({user.email})
          </span>
          <button onClick={() => handleStartDm(user.id)}>DM 보내기</button>
        </div>
      ))}
    </div>
  );
}
