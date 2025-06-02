'use client';

import { useEffect, useState } from 'react';
import { useDmChat } from '@/features/chat/dm/services/useDmChat';
import { useParams } from 'next/navigation';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

export default function DmChatRoomPage() {
  const { roomId } = useParams();
  const parsedRoomId = Number(roomId);
  const [receiverId, setReceiverId] = useState<number | null>(null);
  const [input, setInput] = useState('');

  // 1. receiverId 가져오기: URL 경로 주의 (receiver-id → receiver)
  useEffect(() => {
    const fetchReceiverId = async () => {
      try {
        const res = await fetch(`/api/v1/dm-chat/${parsedRoomId}/receiver-id`);
        const data = await res.json();
        setReceiverId(data);
      } catch (error) {
        console.error('receiverId fetch 실패:', error);
      }
    };

    fetchReceiverId();
  }, [parsedRoomId]);

  // 2. receiverId가 정해진 이후 hook 사용
  const { messages, sendDmMessage } = useDmChat(parsedRoomId, receiverId);

  // 3. 로딩처리 : receiverId가 아직 null이면 로딩 표시만 렌더링
  if (receiverId === null) return <div>로딩 중...</div>;

  // 4. 메시지 UI 구성
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        {messages.map((msg: ChatMessagePayload, idx: number) => (
          <div key={idx} style={{ marginBottom: '6px' }}>
            <strong>{msg.senderId}</strong>: {msg.content}
          </div>
        ))}
      </div>

      {/* 5. 메시지 입력 및 전송 */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
        style={{ padding: '8px', marginRight: '8px' }}
      />
      <button
        onClick={() => {
          if (input.trim()) {
            sendDmMessage(input);
            setInput('');
          }
        }}
        style={{ padding: '8px 16px' }}
      >
        전송
      </button>
    </div>
  );
}
