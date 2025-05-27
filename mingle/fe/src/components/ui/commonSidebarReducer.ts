export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  isActive?: boolean;
}

export interface CommonSidebarState {
  selectedMenuName: string;
  activeIconId: string;
  lastSelectedMenuId: string;
  navigateTo: string | null;
  shouldRefresh: boolean;
}

export type CommonSidebarAction =
  | {
      type: 'SELECT_ICON_MENU';
      payload: {
        iconId: string;
        title: string;
        path: string;
        pathname: string;
      };
    }
  | {
      type: 'DESELECT_ICON_MENU';
      payload: {
        pathname: string;
        lastSelectedMenuId: string;
      };
    }
  | {
      type: 'SELECT_MENU';
      payload: {
        menuItem: MenuItem;
        pathname: string;
      };
    }
  | { type: 'RESET_NAVIGATION' };

export const initialCommonSidebarState: CommonSidebarState = {
  selectedMenuName: '',
  activeIconId: '',
  lastSelectedMenuId: '',
  navigateTo: null,
  shouldRefresh: false,
};

export const commonSidebarReducer = (
  state: CommonSidebarState,
  action: CommonSidebarAction
): CommonSidebarState => {
  switch (action.type) {
    case 'SELECT_ICON_MENU': {
      const { iconId, title, path, pathname } = action.payload;
      return {
        ...state,
        selectedMenuName: title,
        activeIconId: iconId,
        navigateTo: path === pathname ? null : path,
        shouldRefresh: path === pathname,
      };
    }

    case 'DESELECT_ICON_MENU':
      return {
        ...state,
        activeIconId: '',
        navigateTo: null,
        shouldRefresh: false,
      };

    case 'SELECT_MENU': {
      const { menuItem, pathname } = action.payload;
      return {
        ...state,
        selectedMenuName: menuItem.name,
        lastSelectedMenuId: menuItem.id,
        navigateTo: menuItem.path === pathname ? null : menuItem.path,
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
