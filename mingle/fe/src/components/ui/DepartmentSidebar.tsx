'use client';

import { useDepartment } from '@/context/DepartmentContext';
import { departmentMenus } from '@/context/departmentMenus';
import styles from './Sidebar.module.css';

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
            // onClick 등 부서별 메뉴 클릭 핸들러
          >
            {/* 아이콘 처리 */}
            <span>{menu.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
