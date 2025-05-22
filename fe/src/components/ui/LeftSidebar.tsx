'use client';

import React from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import Image from 'next/image';

const MENU = [
  { key: 'schedule', label: '일정', icon: '📅' },
  { key: 'notice', label: '공지사항', icon: '📝' },
  { key: 'attendance', label: '근태', icon: '⏰' },
  { key: 'recruit', label: '모집공고', icon: '🔔' },
  { key: 'goods', label: '상점', icon: '🧊' },
  { key: 'board', label: '업무자료', icon: '📄' },
  { key: 'reservation', label: '회의실예약', icon: '🏷️' },
];

export default function LeftSidebar() {
  const { setDeptOpen } = useSidebar();

  return (
    <aside
      className="left-sidebar"
      style={{
        width: 88,
        background: '#f8f8fc',
        borderRight: '1px solid #ececf3',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 0 0 0',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        boxSizing: 'border-box',
      }}
    >
      {/* 로고/조직명 */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Image
          src="/mingle.png"
          alt="mingle logo"
          width={48}
          height={48}
          style={{ margin: '0 auto 6px auto', display: 'block' }}
        />
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
          &quot;Teamwork. Talent. Together.&quot;
        </div>
      </div>
      {/* 메뉴 */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          width: '100%',
        }}
      >
        {MENU.map((item) => (
          <button
            key={item.key}
            onClick={() => setDeptOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              padding: '8px 0',
              borderRadius: 16,
              transition: 'background 0.2s',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#ede7fa',
                fontSize: 22,
                marginBottom: 4,
              }}
            >
              {item.icon}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#444' }}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
