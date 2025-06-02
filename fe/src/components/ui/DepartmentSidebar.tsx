"use client";

import { useDepartment } from "@/context/DepartmentContext";
import { departmentMenus } from "@/context/departmentMenus";
import styles from "./Sidebar.module.css";
import Link from "next/link";

export default function DepartmentSidebar() {
  const { name: userDepartment } = useDepartment();
  const menus = departmentMenus[userDepartment] || departmentMenus.default;

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
        {menus.map((menu) => (
          <li
            key={menu.id}
            className={`${styles.menuItem} ${
              menu.isActive ? styles.menuItemActive : styles.menuItemInactive
            }`}
          >
            <Link href={menu.path} className={styles.menuLink}>
              <span>{menu.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
