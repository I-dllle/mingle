import { departmentMenus } from '@/context/departmentMenus';

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  isActive?: boolean;
}

export interface DepartmentSidebarState {
  userDepartment: string;
  activeMenus: MenuItem[];
  selectedMenuName: string;
  lastSelectedMenuId: string;
  navigateTo: string | null;
  shouldRefresh: boolean;
}

export type DepartmentSidebarAction =
  | {
      type: 'UPDATE_MENUS';
      payload: { pathname: string; userDepartment: string };
    }
  | {
      type: 'SELECT_MENU';
      payload: { menuItem: MenuItem; pathname: string };
    }
  | { type: 'RESET_NAVIGATION' };

export const initialDepartmentSidebarState: DepartmentSidebarState = {
  userDepartment: 'default',
  activeMenus: [],
  selectedMenuName: '',
  lastSelectedMenuId: '',
  navigateTo: null,
  shouldRefresh: false,
};

export const departmentSidebarReducer = (
  state: DepartmentSidebarState,
  action: DepartmentSidebarAction
): DepartmentSidebarState => {
  switch (action.type) {
    case 'UPDATE_MENUS': {
      const { pathname, userDepartment } = action.payload;
      const menus =
        departmentMenus[userDepartment as keyof typeof departmentMenus] ||
        departmentMenus.default;

      const updatedMenus = menus.map((menu: MenuItem) => ({
        ...menu,
        isActive: menu.path === pathname,
      }));

      const activeMenu = updatedMenus.find((menu: MenuItem) => menu.isActive);

      return {
        ...state,
        userDepartment,
        activeMenus: updatedMenus,
        selectedMenuName: activeMenu?.name ?? '',
        lastSelectedMenuId: activeMenu?.id ?? '',
      };
    }

    case 'SELECT_MENU': {
      const { menuItem, pathname } = action.payload;

      const updatedMenus = state.activeMenus.map((menu) => ({
        ...menu,
        isActive: menu.id === menuItem.id,
      }));

      return {
        ...state,
        activeMenus: updatedMenus,
        selectedMenuName: menuItem.name,
        lastSelectedMenuId: menuItem.id,
        navigateTo: menuItem.path !== pathname ? menuItem.path : null,
        shouldRefresh: menuItem.path === pathname,
      };
    }

    case 'RESET_NAVIGATION':
      return {
        ...state,
        navigateTo: null,
        shouldRefresh: false,
      };

    default:
      return state;
  }
};
