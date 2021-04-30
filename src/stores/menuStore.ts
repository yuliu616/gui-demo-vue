import { Store } from 'vuex';
import { i18n } from '@/translation/i18n';

export const menuStore = {
  namespaced: true,
  state: <MenuStoreState>{
    menuRoot: [
      { code: 'message', title: i18n.view['view.Message'], targetPath: '/message' },
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
