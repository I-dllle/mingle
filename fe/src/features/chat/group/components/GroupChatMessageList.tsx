'use client';

import { useEffect, useRef } from 'react';
import { useGroupChat } from '@/features/chat/group/services/useGroupChat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import styles from './GroupChatMessageList.module.css';
interface GroupChatMessageListProps {
  roomId: number;
}

// 날짜 문자열 추출 유틸
const getDateString = (dateStr: string) => dateStr.split('T')[0];

// 시각 포맷 유틸
const getTimeString = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

export default function GroupChatMessageList({
  roomId,
}: GroupChatMessageListProps) {
  const { messages } = useGroupChat(roomId); // 초기 + 실시간 메시지 통합
  const currentUserId = Number(localStorage.getItem('userId')); // 나와 상대방 구분
  const bottomRef = useRef<HTMLDivElement | null>(null); // 자동 스크롤

  // 메시지 새로 추가될 때마다 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatList}>
      {messages.map((msg: ChatMessagePayload, idx: number) => {
        const isMe = msg.senderId === currentUserId;
        const dateStr = getDateString(msg.createdAt);
        const showDateDivider =
          idx === 0 || dateStr !== getDateString(messages[idx - 1].createdAt); // 🔧 [수정] allMessages → messages

        return (
          <div key={`${msg.createdAt}-${msg.senderId}-${idx}`}>
            {/* 날짜 구분선 */}
            {showDateDivider && (
              <div className={styles.dateSeparator}>
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
                {isMe ? '나' : `사용자 ${msg.senderId}`}
              </div>
              <div className={styles.messageText}>{msg.content}</div>
              <div className={styles.timeStamp}>
                {getTimeString(msg.createdAt)}
              </div>
            </div>
          </div>
        );
      })}

      {/* 자동 스크롤 타겟 */}
      <div ref={bottomRef} />
    </div>
  );
}
