'use client';

import { useEffect, useRef } from 'react';
import { useDmChat } from '@/features/chat/dm/services/useDmChat';
import { ChatMessagePayload } from '@/features/chat/common/types/ChatMessagePayload';
import { MessageFormat } from '@/features/chat/common/types/MessageFormat';
import { useSocket } from '@/hooks/useSocket';
import {
  getDateString,
  getTimeString,
} from '@/features/chat/common/utils/dateUtils';
import styles from './DmChatMessageList.module.css';
interface DmChatMessageListProps {
  roomId: number;
  receiverId: number;
}

export default function DmChatMessageList({
  roomId,
  receiverId,
}: DmChatMessageListProps) {
  const { messages } = useDmChat(roomId, receiverId);

  // 현재 로그인한 사용자 ID와 토큰 가져오기
  const currentUserId = Number(localStorage.getItem('userId'));
  const token = localStorage.getItem('token');

  // WebSocket 수신 메시지 핸들러
  function handleMessage(msg: ChatMessagePayload) {
    console.log('[받은 메시지]', msg);
    // TODO: 메시지 store에 추가 처리 필요
    // 예시: setMessages(prev => [...prev, msg]);
  }

  // 추가: WebSocket 연결
  // const { send, isConnected } = useSocket(roomId, token, handleMessage);

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

              {/* 메시지 포맷 분기 처리 */}
              <div className={styles.messageText}>
                {msg.format === MessageFormat.ARCHIVE ? (
                  <>
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
