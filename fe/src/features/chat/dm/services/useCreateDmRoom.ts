'use client';

import { useRouter } from 'next/navigation';

export function useCreateDmRoom() {
  const router = useRouter();

  const createRoomAndEnter = async (receiverId: number) => {
    const res = await fetch('/api/v1/dm-chat/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ receiverId }),
    });

    if (!res.ok) {
      throw new Error('채팅방 생성 실패');
    }

    const room = await res.json();
    router.push(`/dm/${room.roomId}`);
  };

  return { createRoomAndEnter };
}
