// 사이드바 상태 인터페이스
export interface SidebarState {
  userDepartment: string;
  activeMenus: any[];
  selectedMenuName: string;
  activeIconId: string;
  lastSelectedMenuId: string;
  navigateTo: string | null;
  shouldRefresh: boolean;
}

// 사이드바 액션 타입
export type SidebarAction =
  | { type: "INIT_USER_DEPARTMENT"; payload: string }
  | { type: "SET_ACTIVE_MENUS"; payload: any[] }
  | {
      type: "SELECT_MENU";
      payload: { menuItem: any; pathname: string };
    }
  | {
      type: "SELECT_ICON_MENU";
      payload: {
        iconId: string;
        title: string;
        path: string;
        pathname: string;
      };
    }
  | {
      type: "DESELECT_ICON_MENU";
      payload: {
        pathname: string;
        lastSelectedMenuId: string;
        userDepartment: string;
      };
    }
  | {
      type: "UPDATE_MENUS_BY_PATH";
      payload: {
        pathname: string;
        userDepartment: string;
      };
    }
  | { type: "RESET_NAVIGATION" };

// 초기 상태
export const initialSidebarState: SidebarState = {
  userDepartment: "default",
  activeMenus: [],
  selectedMenuName: "",
  activeIconId: "",
  lastSelectedMenuId: "",
  navigateTo: null,
  shouldRefresh: false,
};

// 사이드바 리듀서
export const sidebarReducer = (
  state: SidebarState,
  action: SidebarAction
): SidebarState => {
  switch (action.type) {
    case "INIT_USER_DEPARTMENT":
      return {
        ...state,
        userDepartment: action.payload,
      };

    case "SET_ACTIVE_MENUS":
      return {
        ...state,
        activeMenus: action.payload,
      };

    case "SELECT_MENU": {
      const { menuItem, pathname } = action.payload;

      // 현재 활성화된 메뉴 비활성화하고 선택한 메뉴 활성화
      const updatedMenus = state.activeMenus.map((menu) => ({
        ...menu,
        isActive: menu.id === menuItem.id,
      }));

      // 네비게이션 정보 저장
      let navigateTo = null;
      let shouldRefresh = false;

      if (menuItem.path) {
        if (menuItem.path === pathname) {
          shouldRefresh = true;
        } else {
          navigateTo = menuItem.path;
        }
      }

      return {
        ...state,
        activeMenus: updatedMenus,
        selectedMenuName: menuItem.name,
        lastSelectedMenuId: menuItem.id,
        activeIconId: "",
        navigateTo,
        shouldRefresh,
      };
    }

    case "SELECT_ICON_MENU": {
      const { iconId, title, path, pathname } = action.payload;

      // 모든 기존 메뉴의 활성화 상태 해제
      const deactivatedMenus = state.activeMenus.map((menu) => ({
        ...menu,
        isActive: false,
      }));

      // 네비게이션 정보 저장
      let navigateTo = null;
      let shouldRefresh = false;

      if (path) {
        if (path === pathname) {
          shouldRefresh = true;
        } else {
          navigateTo = path;
        }
      }

      return {
        ...state,
        activeMenus: deactivatedMenus,
        selectedMenuName: title,
        activeIconId: iconId,
        navigateTo,
        shouldRefresh,
      };
    }

    case "DESELECT_ICON_MENU": {
      const { pathname, lastSelectedMenuId, userDepartment } = action.payload;

      // departmentMenus는 외부에서 import 해야 함
      const { departmentMenus } = require("./LeftSidebar");

      // 현재 URL에 해당하는 메뉴를 찾아 활성화
      const menus =
        departmentMenus[userDepartment as keyof typeof departmentMenus] ||
        departmentMenus.default;

      // 마지막으로 선택한 메뉴 ID가 있으면 해당 메뉴를 활성화
      const updatedMenus = menus.map((menu: any) => ({
        ...menu,
        isActive: lastSelectedMenuId
          ? menu.id === lastSelectedMenuId
          : menu.path === pathname,
      }));

      // 일치하는 메뉴가 없으면 첫 번째 메뉴 활성화
      if (
        !updatedMenus.some((menu: any) => menu.isActive) &&
        updatedMenus.length > 0
      ) {
        updatedMenus[0].isActive = true;
      }

      // 활성화된 메뉴 찾기
      const activeMenu = updatedMenus.find((menu: any) => menu.isActive);

      return {
        ...state,
        activeMenus: updatedMenus,
        selectedMenuName: activeMenu ? activeMenu.name : "",
        activeIconId: "",
        navigateTo: null,
        shouldRefresh: false,
      };
    }

    case "UPDATE_MENUS_BY_PATH": {
      const { pathname, userDepartment } = action.payload;

      // 아이콘 메뉴가 활성화되어 있으면 메뉴 활성화를 건너뜀
      if (state.activeIconId) {
        return state;
      }

      // departmentMenus는 외부에서 import 해야 함
      const { departmentMenus } = require("./LeftSidebar");

      // 현재 부서에 해당하는 메뉴 가져오기
      const menus =
        departmentMenus[userDepartment as keyof typeof departmentMenus] ||
        departmentMenus.default;

      // 현재 URL과 일치하는 메뉴 찾기
      const updatedMenus = menus.map((menu: any) => ({
        ...menu,
        isActive: menu.path === pathname,
      }));

      // 일치하는 메뉴가 없으면 첫번째 메뉴 활성화 (단, 마지막 선택 메뉴가 있으면 그것을 활성화)
      if (
        !updatedMenus.some((menu: any) => menu.isActive) &&
        updatedMenus.length > 0
      ) {
        if (state.lastSelectedMenuId) {
          // 마지막으로 선택된 메뉴가 있으면 해당 메뉴 활성화
          const menuIndex = updatedMenus.findIndex(
            (menu: any) => menu.id === state.lastSelectedMenuId
          );
          if (menuIndex >= 0) {
            updatedMenus[menuIndex].isActive = true;
          } else {
            updatedMenus[0].isActive = true;
          }
        } else {
          updatedMenus[0].isActive = true;
        }
      }

      // 활성화된 메뉴 찾기
      const activeMenu = updatedMenus.find((menu: any) => menu.isActive);
      let newSelectedMenuName = state.selectedMenuName;

      if (activeMenu) {
        newSelectedMenuName = activeMenu.name;
      }

      return {
        ...state,
        activeMenus: updatedMenus,
        selectedMenuName: newSelectedMenuName,
        navigateTo: null,
        shouldRefresh: false,
      };
    }

    case "RESET_NAVIGATION":
      return {
        ...state,
        navigateTo: null,
        shouldRefresh: false,
      };

    default:
      return state;
  }
};
