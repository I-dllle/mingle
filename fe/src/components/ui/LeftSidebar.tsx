'use client';

import { useReducer, useEffect } from 'react';
import { FiCalendar, FiClock, FiBell, FiFileText } from 'react-icons/fi';
import styles from './Sidebar.module.css';
import { useRouter, usePathname } from 'next/navigation';
import {
  commonSidebarReducer,
  initialCommonSidebarState,
} from './commonSidebarReducer';

interface LeftSideBarProps {
  onMenuChange?: (menuName: string) => void;
}

const iconMenus = [
  {
    id: 'calendar',
    title: '일정',
    icon: <FiCalendar className="w-5 h-5" />,
    path: '/schedule',
  },
  {
    id: 'notice',
    title: '공지사항',
    icon: <FiBell className="w-5 h-5" />,
    path: '/board/common',
  },
  {
    id: 'attendance',
    title: '근태',
    icon: <FiClock className="w-5 h-5" />,
    path: '/attendance',
  },
  {
    id: 'store',
    title: '상점',
    icon: <FiFileText className="w-5 h-5" />,
    path: '/dashboard',
  },
];

export default function LeftSidebar({ onMenuChange }: LeftSideBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [state, dispatch] = useReducer(
    commonSidebarReducer,
    initialCommonSidebarState
  );

  useEffect(() => {
    // 선택된 메뉴 이름 부모에게 전달
    if (onMenuChange && state.selectedMenuName) {
      onMenuChange(state.selectedMenuName);
    }
  }, [state.selectedMenuName, onMenuChange]);

  useEffect(() => {
    if (state.navigateTo) {
      router.push(state.navigateTo);
      dispatch({ type: 'RESET_NAVIGATION' });
    }
  }, [state.navigateTo, router]);

  useEffect(() => {
    if (state.shouldRefresh) {
      router.refresh();
      dispatch({ type: 'RESET_NAVIGATION' });
    }
  }, [state.shouldRefresh, router]);

  const handleIconMenuClick = (iconId: string, title: string, path: string) => {
    if (state.activeIconId === iconId) {
      dispatch({
        type: 'DESELECT_ICON_MENU',
        payload: {
          pathname,
          lastSelectedMenuId: state.lastSelectedMenuId,
        },
      });
    } else {
      dispatch({
        type: 'SELECT_ICON_MENU',
        payload: {
          iconId,
          title,
          path,
          pathname,
        },
      });
    }
  };

  return (
    <div className={styles.iconSidebar}>
      {iconMenus.map((item) => (
        <div
          key={item.id}
          onClick={() => handleIconMenuClick(item.id, item.title, item.path)}
          className={`${styles.iconMenuItem} ${
            state.activeIconId === item.id ? styles.iconMenuItemActive : ''
          }`}
          title={item.title}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}
