'use client';

import styles from './Sidebar.module.css';
import { FiCalendar, FiClock, FiBell, FiFileText } from 'react-icons/fi';

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
    path: '/goods',
  },
];

interface IconMenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
}

export default function LeftSidebar() {
  // 아이콘 클릭 핸들러 (라우팅 등)
  const handleIconMenuClick = (item: IconMenuItem) => {
    window.location.href = item.path;
  };

  return (
    <div className={styles.iconSidebar}>
      {iconMenus.map((item) => (
        <div
          key={item.id}
          onClick={() => handleIconMenuClick(item)}
          className={styles.iconMenuItem}
          title={item.title}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}
