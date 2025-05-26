"use client";

import React from "react";
import { useSidebar } from "@/hooks/useSidebar";

export default function DepartmentSidebar() {
  const { isDeptOpen, setDeptOpen } = useSidebar();
  if (!isDeptOpen) return null;

  return (
    <aside
      className="department-sidebar"
      style={{
        position: "fixed",
        left: 88,
        top: 0,
        width: 260,
        height: "100vh",
        background: "#f8f8fc",
        borderRight: "1px solid #ececf3",
        zIndex: 110,
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* 상단 뒤로가기/부서명 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "24px 20px 12px 20px",
          borderBottom: "1px solid #ececf3",
        }}
      >
        <button
          onClick={() => setDeptOpen(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            marginRight: 10,
            cursor: "pointer",
            color: "#a084e8",
          }}
        >
          ←
        </button>{" "}
        <span style={{ fontWeight: 700, fontSize: 18, color: "#333" }}>
          Marketing & PR
        </span>
      </div>
      {/* 메뉴 */}
      <div style={{ padding: "20px 0 0 0", flex: 1 }}>
        <ul
          style={{
            listStyle: "none",
            padding: "0 24px",
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <li
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            <span style={{ marginRight: 10 }}>📁</span> 음원, 영상
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            <span style={{ marginRight: 10 }}>📰</span> 보도자료
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            <span style={{ marginRight: 10 }}>💿</span> 콘텐츠분류, 앨범커버
          </li>
          <li
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            <span style={{ marginRight: 10 }}>🏷️</span> 회의실 예약
          </li>
        </ul>
      </div>
    </aside>
  );
}
