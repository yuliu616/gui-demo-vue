import { Store } from 'vuex';
import { i18nModel } from '@/translation/i18n';
import { rootStore } from '@/stores';

const debug = false;

let i18nLookUp: {[_:string]: string[]} = {
  'message': [ 'view', 'view.Message' ],
  'sys': [ 'word', 'word.core.systemMenu' ],
  'about': [ 'view', 'view.About' ],
  'logout': [ 'view', 'view.Logout' ],
};

export const menuStore = {
  namespaced: true,
  state: <MenuStoreState>{
    menuRoot: [
      { code: 'message', title: '..', targetPath: '/message' },
    ],
    sysMenuRoot: { 
      code: 'sys', title: '..',
      children: [
        { code: 'about', title: '..', targetPath: '/about' },
        { code: 'logout', title: '..', insertDivider: true },
      ]
    },
  },
  mutations: {
    setTranslationBundle(state: MenuStoreState, bundle: i18nModel){
      // redo translation for all menu items
      if (debug) console.log('menuStore:setTranslationBundle use i18n:', bundle);
      for (let child of state.menuRoot) {
        translateRecursively(child, i18nLookUp, bundle);
      }
      translateRecursively(state.sysMenuRoot, i18nLookUp, bundle);
    },
  },
  actions: {
    async init(store: Store<MenuStoreState>){
      let bundle: i18nModel = (<any>rootStore.state).preferenceStore.i18n;
      if (debug) console.log('menuStore:init use i18n:', bundle);
      store.commit('setTranslationBundle', bundle);
    },
  },
}

/**
 * @param lookUp mapping with key = menuItem.code, value = tuple(i18n pack + code)
 */
export function translateRecursively(target: MenuItem, 
  lookUp: {[_:string]: string[]},
  bundle: i18nModel,
){
  let found = lookUp[target.code];
  if (found) {
    let translated = bundle.t(found[0], found[1]);
    target.title = translated;
  }
  if (target.children) {
    for (let child of target.children) {
      translateRecursively(child, lookUp, bundle);
    }
  }
}

export interface MenuStoreState {
  menuRoot: MenuItem[];
  sysMenuRoot: MenuItem;
}

export interface MenuItem {
  code: string;
  title: string;
  targetPath?: string;
  insertDivider?: boolean;
  children?: MenuItem[];
}
