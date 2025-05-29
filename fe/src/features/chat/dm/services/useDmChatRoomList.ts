import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/apiClient';
import { DmChatRoomSummary } from '../types/DmChatRoomSummary';

export function useDmChatRoomList() {
  const [rooms, setRooms] = useState<DmChatRoomSummary[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await apiClient<DmChatRoomSummary[]>(
        '/api/v1/dm-chat/summary'
      );
      setRooms(data);
    };
    fetchRooms();
  }, []);

  return { rooms };
}
