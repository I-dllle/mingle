'use client';

import { useState, useRef, useEffect } from 'react';
import { useGroupChat } from '@/features/chat/group/services/useGroupChat';
import styles from './GroupChatInput.module.css';

interface GroupChatInputProps {
  roomId: number;
}

export default function GroupChatInput({ roomId }: GroupChatInputProps) {
  // [1] 입력 상태 정의
  const [content, setContent] = useState('');
  // [2] 중복 전송 방지용 상태
  const [isSending, setIsSending] = useState(false);
  // [3] 그룹 채팅 메시지 WebSocket 전송 함수
  const { sendGroupMessage } = useGroupChat(roomId);
  // 입력창 포커싱용 ref
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus(); // 마운트 시 자동 포커싱
  }, []);

  // [4] 전송 처리 함수
  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();

    // 입력값이 공백만 있을 경우 전송 방지
    if (!content.trim() || isSending) return;

    try {
      setIsSending(true);
      // 전송 시 서버로 메시지 전송, async 처리로 실패 대응 가능
      await sendGroupMessage(content);
      setContent('');
    } catch (err) {
      console.error('메시지 전송 실패:', err); // 에러 핸들링
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    // [4] 채팅 입력 폼 렌더링
    <form onSubmit={handleSubmit} className={styles.inputContainer}>
      {/* [5] 입력창 */}
      <input
        ref={inputRef} // 입력창 포커싱 연결
        type="text"
        placeholder="메시지를 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          // Enter로 메시지 전송 (Shift+Enter 제외)
          if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
        }}
        disabled={isSending} // 전송 중 입력 비활성화
        className={styles.textInput}
      />
      {/* 전송 버튼 구성 */}
      <button
        type="submit"
        className={styles.sendButton}
        disabled={!content.trim() || isSending} // 전송 조건 및 중복 방지
      >
        전송
      </button>
    </form>
  );
}
