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

  // Hook은 항상 조건 없이 호출되어야 함
  const { messages, sendDmMessage } = useDmChat(parsedRoomId, receiverId);

  // receiverId를 백엔드에서 먼저 받아옴
  useEffect(() => {
    const fetchReceiverId = async () => {
      try {
        const res = await fetch(`/api/v1/dm-chat/${parsedRoomId}/receiver-id`);
        const data = await res.json();
        setReceiverId(data.receiverId);
      } catch (error) {
        console.error('receiverId fetch 실패:', error);
      }
    };

    fetchReceiverId();
  }, [parsedRoomId]);

  // receiverId가 없으면 로딩 상태 표시
  if (receiverId === null) return <div>로딩 중...</div>;

  // receiverId가 아직 null이면 로딩 표시만 렌더링
  if (receiverId === null) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '12px' }}>
        {messages.map((msg: ChatMessagePayload, idx: number) => (
          <div key={idx} style={{ marginBottom: '6px' }}>
            <strong>{msg.senderId}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: '8px', marginRight: '8px' }}
      />
      <button
        onClick={() => {
          sendDmMessage(input);
          setInput('');
        }}
        style={{ padding: '8px 16px' }}
      >
        전송
      </button>
    </div>
  );
}
