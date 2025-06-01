'use client';

import styles from './DmChatMessageList.module.css';
import { useEffect, useRef } from 'react';
import { useDmChat } from '@/features/chat/dm/services/useDmChat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';

interface DmChatMessageListProps {
  roomId: number;
  receiverId: number;
}

// 날짜 추출 유틸
const getDateString = (dateStr: string) => dateStr.split('T')[0];

// 시간 포맷 유틸
const getTimeString = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function DmChatMessageList({
  roomId,
  receiverId,
}: DmChatMessageListProps) {
  const { messages } = useDmChat(roomId, receiverId);

  // 현재 로그인한 사용자 ID (임시: 로컬에서 가져옴)
  const currentUserId = Number(localStorage.getItem('userId'));

  const bottomRef = useRef<HTMLDivElement | null>(null); // 스크롤 타겟 ref

  // 메시지 변화 시 스크롤 하단 고정
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatList}>
      {messages.map((msg: ChatMessagePayload, idx: number) => {
        // 보낸 사람이 나인지 확인
        const isMe = msg.senderId === currentUserId;

        const messageDate = getDateString(msg.createdAt);

        const shouldShowDate =
          idx === 0 ||
          messageDate !== getDateString(messages[idx - 1].createdAt);

        return (
          <div key={idx}>
            {/* 날짜 구분선 */}
            {shouldShowDate && (
              <div
                className="date-separator"
                style={{
                  textAlign: 'center',
                  margin: '16px 0',
                  fontWeight: 'bold',
                  color: '#999',
                  fontSize: '14px',
                }}
              >
                {new Date(msg.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  weekday: 'short',
                })}
              </div>
            )}

            {/* 메시지 박스 */}
            <div
              className={`${styles.chatBubble} ${
                isMe ? styles.mine : styles.opponent
              }`}
            >
              <div className={styles.senderLabel}>
                {isMe ? '나' : `상대(${msg.senderId})`}
              </div>

              <div className={styles.messageText}>{msg.content}</div>
              <div className={styles.timeStamp}>
                {getTimeString(msg.createdAt)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
