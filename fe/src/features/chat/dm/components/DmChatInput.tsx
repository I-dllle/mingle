'use client';

import { useState } from 'react';
import { useDmChat } from '@/features/chat/dm/services/useDmChat';
import styles from './DmChatInput.module.css';

interface DmChatInputProps {
  roomId: number; // roomId, receiverId props로 받음
  receiverId: number;
}

export default function DmChatInput({ roomId, receiverId }: DmChatInputProps) {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { sendDmMessage } = useDmChat(roomId, receiverId);

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault(); // 기본 submit 막기

    if (!content.trim() || isSending) return; // 빈 메시지 or 중복 전송 방지

    try {
      setIsSending(true);
      await sendDmMessage(content); // WebSocket 전송
      setContent('');
    } catch (err) {
      console.error('DM 메시지 전송 실패:', err);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputContainer}>
      {' '}
      {/* [수정] - form으로 변경 */}
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e); // [수정] - Enter로 전송
        }}
        disabled={isSending} // [수정]
        className={styles.textInput} // [유지]
      />
      <button
        type="submit"
        disabled={!content.trim() || isSending} // [유지]
        className={styles.sendButton} // [유지]
      >
        전송
      </button>
    </form>
  );
}
