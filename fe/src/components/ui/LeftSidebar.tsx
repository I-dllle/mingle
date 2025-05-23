"use client";

import { useState, useEffect } from "react";
import {
  FiHome,
  FiCalendar,
  FiClock,
  FiBell,
  FiFileText,
} from "react-icons/fi";
import styles from "./LeftSidebar.module.css";
import { useRouter, usePathname } from "next/navigation";

interface LeftSideBarProps {
  department?: string;
  onMenuChange?: (menuName: string) => void;
}

// 임시 사용자 데이터 인터페이스
interface UserData {
  id: string;
  name: string;
  department: string;
  role: string;
  email: string;
}

// 임시 사용자 데이터
const tempUserData: UserData = {
  id: "USER001",
  name: "김민준",
  department: "development",
  role: "선임 개발자",
  email: "minjun.kim@example.com",
};

// 왼쪽 아이콘 메뉴 정의
const iconMenus = [
  {
    id: "calendar",
    title: "일정",
    icon: <FiCalendar className="w-5 h-5" />,
    path: "/dashboard",
  },
  {
    id: "notice",
    title: "공지사항",
    icon: <FiBell className="w-5 h-5" />,
    path: "/board/common",
  },
  {
    id: "attendance",
    title: "근태",
    icon: <FiClock className="w-5 h-5" />,
    path: "/panel/attendance",
  },
  {
    id: "recruitment",
    title: "모집공고",
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    path: "/board/department",
  },
  {
    id: "store",
    title: "상점",
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
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    path: "/main/goods",
  },
  {
    id: "workdata",
    title: "업무자료",
    icon: <FiFileText className="w-5 h-5" />,
    path: "/main/board/department",
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
    path: "/main/reservation",
  },
];

// 부서별 메뉴 설정
const departmentMenus = {
  "marketing&PR": [
    {
      id: "contract",
      name: "계약서 관리",
      icon: "document",
      isActive: true,
      path: "/finance-legal/contracts",
    },
    {
      id: "settlement",
      name: "정산 내역 관리",
      icon: "document",
      path: "/finance-legal/revenue",
    },
    {
      id: "property",
      name: "지적 재산권 관리",
      icon: "chart",
      path: "/finance-legal/property",
    },
    {
      id: "regulation",
      name: "내부 규정",
      icon: "book",
      path: "/main/board/department",
    },
    {
      id: "legal",
      name: "법률 자문",
      icon: "shield",
      path: "/finance-legal/legal",
    },
    {
      id: "meeting",
      name: "회의실 예약",
      icon: "calendar",
      path: "/main/reservation",
    },
  ],
  development: [
    {
      id: "project",
      name: "프로젝트 관리",
      icon: "document",
      isActive: true,
      path: "/dashboard",
    },
    {
      id: "code",
      name: "코드 리뷰",
      icon: "document",
      path: "/panel/contracts",
    },
    {
      id: "deploy",
      name: "배포 관리",
      icon: "chart",
      path: "/main/board/department",
    },
    {
      id: "bug",
      name: "버그 트래킹",
      icon: "bug",
      path: "/main/board/department",
    },
    {
      id: "document",
      name: "기술 문서",
      icon: "book",
      path: "/main/board/department",
    },
  ],
  design: [
    {
      id: "asset",
      name: "에셋 관리",
      icon: "document",
      isActive: true,
      path: "/main/board/department",
    },
    {
      id: "color",
      name: "컬러 시스템",
      icon: "palette",
      path: "/main/board/department",
    },
    {
      id: "typography",
      name: "타이포그래피",
      icon: "text",
      path: "/main/board/department",
    },
    {
      id: "brand",
      name: "브랜드 가이드",
      icon: "book",
      path: "/main/board/department",
    },
    {
      id: "prototype",
      name: "프로토타입",
      icon: "pen",
      path: "/main/board/department",
    },
  ],
  hr: [
    {
      id: "employee",
      name: "직원 관리",
      icon: "document",
      isActive: true,
      path: "/users",
    },
    {
      id: "recruitment",
      name: "채용 관리",
      icon: "document",
      path: "/main/board/department",
    },
    {
      id: "attendance",
      name: "근태 관리",
      icon: "clock",
      path: "/main/attendance/calendar",
    },
    {
      id: "evaluation",
      name: "평가 관리",
      icon: "chart",
      path: "/main/board/department",
    },
    {
      id: "education",
      name: "교육 관리",
      icon: "book",
      path: "/main/board/department",
    },
  ],
  default: [
    {
      id: "dashboard",
      name: "대시보드",
      icon: "document",
      isActive: true,
      path: "/dashboard",
    },
    { id: "profile", name: "프로필", icon: "user", path: "/panel/contracts" },
    {
      id: "setting",
      name: "설정",
      icon: "setting",
      path: "/panel/users",
    },
  ],
};

// 아이콘 컴포넌트 렌더링 함수
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "document":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="8" y1="16" x2="16" y2="16"></line>
          <line x1="8" y1="8" x2="10" y2="8"></line>
        </svg>
      );
    case "chart":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
        </svg>
      );
    case "book":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      );
    case "shield":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      );
    case "calendar":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      );
    case "bug":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <path d="M12 1L8 5h8l-4-4z"></path>
          <path d="M5 9h14M5 15h14"></path>
          <path d="M12 20v-8"></path>
          <path d="M8 17l4 3 4-3"></path>
        </svg>
      );
    case "palette":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <circle cx="13.5" cy="6.5" r="1.5"></circle>
          <circle cx="17.5" cy="10.5" r="1.5"></circle>
          <circle cx="8.5" cy="7.5" r="1.5"></circle>
          <circle cx="6.5" cy="12.5" r="1.5"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
        </svg>
      );
    case "user":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      );
    case "setting":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      );
    case "pen":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
      );
    case "text":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <polyline points="4 7 4 4 20 4 20 7"></polyline>
          <line x1="9" y1="20" x2="15" y2="20"></line>
          <line x1="12" y1="4" x2="12" y2="20"></line>
        </svg>
      );
    case "clock":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.menuIcon}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
    default:
      return null;
  }
};

export default function LeftSideBar({
  department = "default",
  onMenuChange,
}: LeftSideBarProps) {
  const [userDepartment, setUserDepartment] = useState(department);
  const [activeMenus, setActiveMenus] = useState<any[]>([]);
  const [selectedMenuName, setSelectedMenuName] = useState<string>("");
  const [activeIconId, setActiveIconId] = useState<string>(""); // 초기에는 아이콘 메뉴 비활성화 상태로 시작
  const router = useRouter();
  const pathname = usePathname();
  // 사용자 정보 가져오기(임시 데이터 사용)
  useEffect(() => {
    // 임시 사용자 데이터에서 부서 정보를 가져옴
    setUserDepartment(tempUserData.department);

    // 개발 확인용 로그
    console.log("현재 사용자:", tempUserData);
  }, []); // 부서에 따라 메뉴 설정 및 현재 URL에 맞는 메뉴 활성화
  useEffect(() => {
    // 아이콘 메뉴가 활성화되어 있으면 메뉴 활성화를 건너뜀
    if (activeIconId) {
      return;
    }

    const menus =
      departmentMenus[userDepartment as keyof typeof departmentMenus] ||
      departmentMenus.default;

    // 클라이언트 사이드에서만 실행되는 코드
    if (typeof window !== "undefined") {
      // 현재 URL과 일치하는 메뉴 찾기
      const currentPath = window.location.pathname;
      const updatedMenus = menus.map((menu) => ({
        ...menu,
        isActive: menu.path === currentPath,
      }));

      // 일치하는 메뉴가 없으면 첫 번째 메뉴를 활성화
      if (!updatedMenus.some((menu) => menu.isActive)) {
        if (updatedMenus.length > 0) {
          updatedMenus[0].isActive = true;
        }
      }

      setActiveMenus(updatedMenus);

      // 활성화된 메뉴 찾기
      const activeMenu = updatedMenus.find((menu) => menu.isActive);
      if (activeMenu) {
        setSelectedMenuName(activeMenu.name);
        if (onMenuChange) {
          onMenuChange(activeMenu.name);
        }
      }
    } else {
      // SSR 환경에서는 첫 번째 메뉴 선택
      const updatedMenus = menus.map((menu, index) => ({
        ...menu,
        isActive: index === 0,
      }));

      setActiveMenus(updatedMenus);

      if (updatedMenus.length > 0 && onMenuChange) {
        setSelectedMenuName(updatedMenus[0].name);
        onMenuChange(updatedMenus[0].name);
      }
    }
  }, [userDepartment, onMenuChange, activeIconId]); // 라우터 변경 감지 및 현재 경로에 맞는 메뉴 활성화
  useEffect(() => {
    // 아이콘 메뉴가 활성화되어 있으면 메뉴 활성화를 건너뜀
    if (activeIconId) {
      return;
    }

    // 현재 부서에 해당하는 메뉴 가져오기
    const menus =
      departmentMenus[userDepartment as keyof typeof departmentMenus] ||
      departmentMenus.default;

    // 현재 URL과 일치하는 메뉴 찾기
    const updatedMenus = menus.map((menu) => ({
      ...menu,
      isActive: menu.path === pathname,
    }));

    // 일치하는 메뉴가 없으면 첫번째 메뉴 활성화
    if (
      !updatedMenus.some((menu) => menu.isActive) &&
      updatedMenus.length > 0
    ) {
      updatedMenus[0].isActive = true;
    }

    setActiveMenus(updatedMenus);

    // 활성화된 메뉴 찾기
    const activeMenu = updatedMenus.find((menu) => menu.isActive);
    if (activeMenu) {
      setSelectedMenuName(activeMenu.name);
      if (onMenuChange) {
        onMenuChange(activeMenu.name);
      }
    }
  }, [pathname, userDepartment, onMenuChange, activeIconId]); // 메뉴 선택 핸들러
  const handleMenuClick = (menuItem: any) => {
    // 현재 활성화된 메뉴 비활성화
    const updatedMenus = activeMenus.map((menu) => ({
      ...menu,
      isActive: menu.id === menuItem.id,
    }));

    setActiveMenus(updatedMenus);
    setSelectedMenuName(menuItem.name);

    // 아이콘 메뉴 선택 상태 초기화
    setActiveIconId("");

    // 상위 컴포넌트에 선택된 메뉴 이름 전달
    if (onMenuChange) {
      onMenuChange(menuItem.name);
    }

    // 해당 메뉴의 경로로 이동
    if (menuItem.path) {
      // 이미 현재 경로와 같다면 라우터를 새로고침하여 강제 리렌더링
      if (menuItem.path === pathname) {
        router.refresh();
      } else {
        router.push(menuItem.path);
      }
    }
  }; // 왼쪽 아이콘 메뉴 선택 핸들러
  const handleIconMenuClick = (iconId: string, title: string, path: string) => {
    // 이전에 선택된 아이콘과 같은 아이콘을 클릭한 경우, 선택을 취소
    if (activeIconId === iconId) {
      setActiveIconId("");
      // 현재 URL에 해당하는 메뉴를 찾아 활성화
      const menus =
        departmentMenus[userDepartment as keyof typeof departmentMenus] ||
        departmentMenus.default;
      const updatedMenus = menus.map((menu) => ({
        ...menu,
        isActive: menu.path === pathname,
      }));

      // 일치하는 메뉴가 없으면 첫 번째 메뉴 활성화
      if (
        !updatedMenus.some((menu) => menu.isActive) &&
        updatedMenus.length > 0
      ) {
        updatedMenus[0].isActive = true;
      }

      setActiveMenus(updatedMenus);

      // 활성화된 메뉴 찾기
      const activeMenu = updatedMenus.find((menu) => menu.isActive);
      if (activeMenu) {
        setSelectedMenuName(activeMenu.name);
        if (onMenuChange) {
          onMenuChange(activeMenu.name);
        }
      }
    } else {
      // 새로운 아이콘 선택
      setActiveIconId(iconId);

      // 모든 기존 메뉴의 활성화 상태 해제
      const deactivatedMenus = activeMenus.map((menu) => ({
        ...menu,
        isActive: false,
      }));
      setActiveMenus(deactivatedMenus);

      // 상위 컴포넌트에 선택된 아이콘 타이틀 전달
      if (onMenuChange) {
        onMenuChange(title);
      }
      setSelectedMenuName(title);

      // 해당 경로로 이동
      if (path) {
        if (path === pathname) {
          router.refresh();
        } else {
          router.push(path);
        }
      }
    }
  };

  return (
    <>
      {/* 가장 왼쪽 아이콘 전용 사이드바 */}
      <div className={styles.iconSidebar}>
        {/* 아이콘 메뉴 */}
        {iconMenus.map((item) => (
          <div
            key={item.id}
            onClick={() => handleIconMenuClick(item.id, item.title, item.path)}
            className={`${styles.iconMenuItem} ${
              activeIconId === item.id ? styles.iconMenuItemActive : ""
            }`}
            title={item.title}
          >
            {item.icon}
          </div>
        ))}
      </div>
      {/* 기존 왼쪽 사이드바 메뉴 */}
      <div className={styles.mainSidebar}>
        {" "}
        {/* 로고 영역 */}
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="Mingle Logo" className={styles.logoImage} />
          <div className={styles.logoSubtitle}>
            "Teamwork. Talent. Together."
          </div>
          <div className={styles.departmentTitle}>{userDepartment}</div>
        </div>
        {/* 주 메뉴 아이템 */}
        <ul className={styles.menuList}>
          {activeMenus.map((menu) => (
            <li
              key={menu.id}
              className={`${styles.menuItem} ${
                menu.isActive ? styles.menuItemActive : styles.menuItemInactive
              }`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu.icon.startsWith("/") ? (
                <img
                  src={menu.icon}
                  alt={menu.name}
                  className={styles.menuIcon}
                />
              ) : (
                getIconComponent(menu.icon)
              )}
              <span>{menu.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
