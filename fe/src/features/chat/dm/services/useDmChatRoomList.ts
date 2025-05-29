import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/apiClient';
import { ChatRoomSummary } from '../types/ChatRoomSummary';

export function useDmChatRoomList() {
  const [rooms, setRooms] = useState<ChatRoomSummary[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const data = await apiClient<ChatRoomSummary[]>(
        '/api/v1/dm-chat/summary'
      );
      setRooms(data);
    };
    fetchRooms();
  }, []);

  return { rooms };
}
