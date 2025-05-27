'use client';

import React from 'react';

export default function RightMessenger() {
  return (
    <aside
      className="right-messenger"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: 296,
        height: '100vh',
        background: '#f8f8fc',
        borderLeft: '1px solid #ececf3',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.04)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ padding: '32px 24px 0 24px', flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 19,
            marginBottom: 18,
            color: '#222',
          }}
        >
          Team Chat
        </div>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#b6f5c6',
                display: 'inline-block',
                marginRight: 8,
              }}
            />
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>
              채팅방
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#dbeafe',
                display: 'inline-block',
                marginRight: 8,
              }}
            />
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>
              자료방
            </span>
          </div>
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 19,
            marginBottom: 18,
            color: '#222',
          }}
        >
          Project Chat
        </div>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#b6f5c6',
                display: 'inline-block',
                marginRight: 8,
              }}
            />
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>
              채팅방
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#dbeafe',
                display: 'inline-block',
                marginRight: 8,
              }}
            />
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>
              자료방
            </span>
          </div>
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 19,
            marginBottom: 18,
            color: '#222',
          }}
        >
          DM
        </div>
        <div>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#fbeee6',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                marginRight: 10,
              }}
            >
              😀
            </span>
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>
              통통통 사후르
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                marginLeft: 8,
              }}
            />
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#e0e7ff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                marginRight: 10,
              }}
            >
              🦁
            </span>
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>
              발레리나 카푸치나
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                marginLeft: 8,
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#fef9c3',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                marginRight: 10,
              }}
            >
              🥑
            </span>
            <span style={{ fontWeight: 600, color: '#222', fontSize: 15 }}>
              아보카도
            </span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#a3a3a3',
                display: 'inline-block',
                marginLeft: 8,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          padding: 24,
          borderTop: '1px solid #ececf3',
          background: '#ede7fa',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}
        >
          🧑‍💻
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#222' }}>
            김도연
          </div>
          <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>
            온라인
          </div>
        </div>
        <span style={{ fontSize: 20, color: '#a084e8', cursor: 'pointer' }}>
          ⚙️
        </span>
        <span style={{ fontSize: 20, color: '#a084e8', cursor: 'pointer' }}>
          🔔
        </span>
      </div>
    </aside>
  );
}
