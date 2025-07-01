"use client";

import { useDepartment } from "@/context/DepartmentContext";
import { departmentMenus } from "@/context/departmentMenus";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DepartmentSidebar() {
  const { name: userDepartment } = useDepartment();
  const pathname = usePathname();
  const menus = departmentMenus[userDepartment] || departmentMenus.default;

  // 디버깅용 로그
  console.log("DepartmentSidebar - userDepartment:", userDepartment);
  console.log("DepartmentSidebar - pathname:", pathname);
  console.log("DepartmentSidebar - menus:", menus);

  return (
    <aside className={styles.mainSidebar}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Mingle Logo" className={styles.logoImage} />
        <div className={styles.logoSubtitle}>
          &quot;Teamwork. Talent. Together.&quot;
        </div>
        <div className={styles.departmentTitle}>{userDepartment}</div>
      </div>
      <ul className={styles.menuList}>
        {menus.map((menu) => {
          // 현재 경로와 메뉴 경로를 비교하여 활성 상태 결정
          const isActive = pathname.includes(menu.path.replace('/', ''));
          
          return (
            <li
              key={menu.id}
              className={`${styles.menuItem} ${
                isActive ? styles.menuItemActive : styles.menuItemInactive
              }`}
            >
              <Link href={menu.path} className={styles.menuLink}>
                <span>{menu.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
