'use client';

import { useEffect, useState } from 'react';
import { DmChatRoomSummary } from '../types/DmChatRoomSummary';
import { apiClient } from '@/lib/api/apiClient';

export function useDmChatRoomList() {
  // 상태 정의
  const [rooms, setRooms] = useState<DmChatRoomSummary[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 여부 표시용

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // apiClient가 내부적으로 JSON 파싱 + 에러 처리까지 해주는 경우
        const data = await apiClient<DmChatRoomSummary[]>('/dm-chat/summary');
        setRooms(data); // 성공 시 상태 반영
      } catch (err) {
        console.error('채팅방 요약 정보 불러오기 실패:', err);
        setRooms([]); // 실패 시 rooms 초기화
      } finally {
        setLoading(false);
      }
    };

    fetchRooms(); // 컴포넌트 마운트 시 데이터 불러오기
  }, []); // 최초 1회 실행

  return { rooms, loading }; // 로딩 상태 포함 반환
}
