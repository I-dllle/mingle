'use client';

import { useEffect, useRef } from 'react';
import { useGroupChat } from '@/features/chat/group/services/useGroupChat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import {
  getDateString,
  getTimeString,
} from '@/features/chat/common/utils/dateUtils';
import styles from './GroupChatMessageList.module.css';
interface GroupChatMessageListProps {
  roomId: number;
}

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
          idx === 0 || dateStr !== getDateString(messages[idx - 1].createdAt);

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

              {/* 메시지 포맷 분기 처리 */}
              <div className={styles.messageText}>
                {msg.format === MessageFormat.ARCHIVE ? (
                  <>
                    {/* 파일명만 출력 */}
                    <a
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1890ff', textDecoration: 'underline' }}
                    >
                      📎 {msg.content.split('/').pop()} {/* 파일명만 출력 */}
                    </a>

                    {/* 태그 정보 표시 */}
                    {!!msg.tagNames && msg.tagNames.length > 0 && (
                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '12px',
                          color: '#999',
                        }}
                      >
                        {msg.tagNames.map((tag) => (
                          <span key={tag} style={{ marginRight: '6px' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  msg.content
                )}
              </div>

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
