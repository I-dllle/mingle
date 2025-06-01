'use client';

import { useEffect, useState } from 'react';
import { DmChatRoomSummary } from '../types/DmChatRoomSummary';

export function useDmChatRoomList() {
  // 상태 정의
  const [rooms, setRooms] = useState<DmChatRoomSummary[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 여부 표시용

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // fetch 직접 호출 + Authorization 헤더 명시
        const res = await fetch('/api/v1/dm-chat/summary', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰 인증 추가
          },
        });

        if (!res.ok) throw new Error('채팅방 요약 정보를 불러오지 못했습니다'); // 오류 핸들링 추가

        const data = await res.json(); // 응답 파싱
        setRooms(data); // 성공 시 상태 반영
      } catch (err) {
        console.error(err); // 오류 로그 출력
        setRooms([]); // 실패 시 rooms 초기화
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchRooms(); // 컴포넌트 마운트 시 데이터 불러오기
  }, []); // 최초 1회 실행

  return { rooms, loading }; // 로딩 상태 포함 반환
}
