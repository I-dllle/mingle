"use client";

import styles from "./Sidebar.module.css";
import { FiCalendar, FiClock, FiBell, FiFileText, FiBox } from "react-icons/fi";

const iconMenus = [
  {
    id: "calendar",
    title: "일정",
    icon: <FiCalendar className="w-5 h-5" />,
    path: "/schedule",
  },
  {
    id: "board",
    title: "공지사항",
    icon: <FiFileText className="w-5 h-5" />,
    path: "/board/common/notices",
  },
  {
    id: "attendance",
    title: "근태",
    icon: <FiClock className="w-5 h-5" />,
    path: "/attendance",
  },
  {
    id: "recruit",
    title: "모집공고",
    icon: <FiBell className="w-5 h-5" />,
    path: "/recruit",
  },
  {
    id: "documents",
    title: "업무자료",
    icon: <FiFileText className="w-5 h-5" />,
    path: "/board/common/businessDocuments",
  },
  {
    id: "reservation",
    title: "회의실 예약",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    path: "/reservation",
  },
  {
    id: "store",
    title: "상점",
    icon: <FiBox className="w-5 h-5" />,
    path: "/goods",
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
