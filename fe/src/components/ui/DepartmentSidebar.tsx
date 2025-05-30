"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDepartment } from "@/context/DepartmentContext";
import { departmentMenus } from "@/context/departmentMenus";
import styles from "./Sidebar.module.css";

export default function DepartmentSidebar() {
  const { name: userDepartment } = useDepartment();
  const pathname = usePathname();
  const menus = departmentMenus[userDepartment] || departmentMenus.default;

  return (
    <aside className={styles.mainSidebar}>
      <div className={styles.logoContainer}>
        <img src="/logo.png" alt="Mingle Logo" className={styles.logoImage} />
        <div className={styles.logoSubtitle}>
          &quot;Teamwork. Talent. Together.&quot;
        </div>
        <div className={styles.departmentTitle}>{userDepartment}</div>
      </div>{" "}
      <ul className={styles.menuList}>
        {menus.map((menu) => {
          const isActive =
            pathname === menu.path || pathname.startsWith(`${menu.path}/`);
          return (
            <li key={menu.id}>
              <Link
                href={menu.path}
                className={`${styles.menuItem} ${
                  isActive ? styles.menuItemActive : styles.menuItemInactive
                }`}
                onClick={() => console.log("클릭됨:", menu.path)}
              >
                {/* 아이콘 처리 */}
                <span>{menu.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
