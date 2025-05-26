'use client';

import React from 'react';
import styles from './Sidebar.module.css';
import { useSidebar } from '@/hooks/useSidebar';
import { useDepartment } from '@/context/DepartmentContext';
import { departmentMenus } from '@/context/departmentMenus';
import Link from 'next/link';

export default function DepartmentSidebar() {
  const { isDeptOpen, setDeptOpen } = useSidebar();
  const { name: userDepartment } = useDepartment();
  const menus = departmentMenus[userDepartment] || departmentMenus.default;

  if (!isDeptOpen) return null;

  return (
    <aside
      className="department-sidebar"
      style={{
        position: 'fixed',
        left: 88,
        top: 0,
        width: 260,
        height: '100vh',
        background: '#f8f8fc',
        borderRight: '1px solid #ececf3',
        zIndex: 110,
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {/* 상단 뒤로가기/부서명 */}
      <div className={styles.logoContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setDeptOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              marginRight: 10,
              cursor: 'pointer',
              color: '#a084e8',
            }}
          >
            ←
          </button>
          <img src="/logo.png" alt="Mingle Logo" className={styles.logoImage} />
        </div>
        <div className={styles.logoSubtitle}>Teamwork. Talent. Together.</div>
        <div className={styles.departmentTitle}>
          {userDepartment || '부서없음'}
        </div>
      </div>

      {/* 메뉴 */}
      <div style={{ padding: '20px 0 0 0', flex: 1 }}>
        <ul
          style={{
            listStyle: 'none',
            padding: '0 24px',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {menus.map((menu) => (
            <li
              key={menu.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontWeight: 500,
                fontSize: 15,
              }}
            >
              {menu.icon && (
                <span style={{ marginRight: 10 }}>{menu.icon}</span>
              )}
              <Link
                href={menu.path}
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {menu.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
