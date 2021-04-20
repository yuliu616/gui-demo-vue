import { Store } from 'vuex';

export const menuStore = {
  namespaced: true,
  state: <MenuStoreState>{
    menuRoot: [
      { code: 'message', title: 'Messages', targetPath: '/message' },
    ],
  },
}

export interface MenuStoreState {
  menuRoot: MenuItem[];
}

export interface MenuItem {
  code: string;
  title: string;
  targetPath?: string;
  insertDivider?: boolean;
  children?: MenuItem[];
}
