'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/apiClient';
import { GroupChatRoomSummary } from '@/features/chat/group/types/GroupChatRoomSummary';

export function useGroupChatRoomList() {
  // 그룹 채팅방 목록 상태 정의
  const [rooms, setRooms] = useState<GroupChatRoomSummary[]>([]);

  useEffect(() => {
    // 그룹 채팅방 목록을 백엔드에서 불러오는 함수
    const fetchRooms = async () => {
      try {
        // GET /api/v1/group-chats/rooms 호출
        const res = await apiClient<GroupChatRoomSummary[]>(
          '/api/v1/group-chats/rooms'
        );

        // 성공적으로 응답 받았을 경우 상태 업데이트
        setRooms(res);
      } catch (error) {
        // 실패 시 에러 콘솔 출력
        console.error('그룹 채팅방 목록 불러오기 실패:', error);
      }
    };

    // 컴포넌트가 마운트될 때 그룹 채팅방 목록 불러오기 실행
    fetchRooms();
  }, []);

  // 그룹 채팅방 목록 상태 반환
  return { rooms };
}
