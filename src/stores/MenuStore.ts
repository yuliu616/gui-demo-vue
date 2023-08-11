import { type i18nModel } from "@/translation/i18n";
import { defineStore } from "pinia";
import { usePreferenceStore } from "./PreferenceStore";
import { LocaleCode } from "@/model/LocaleCode";
import { ref, type Ref } from "vue";
import type { PropertyBagWithType } from "@/model/core/CoreTypes";
import type { ILogger } from "@/model/core/ILogger";

const debug = false;
const logger: ILogger = console;

// for each menu code, bundle and i18n code of it's title.
let i18nLookUp: {[_:string]: string[]} = {
  'home': [ 'view', 'view.Home' ],
  'about': [ 'view', 'view.About' ],
  'switchToDarkTheme': [ 'message', 'sentence.switchToDarkTheme' ],
  'switchToLightTheme': [ 'message', 'sentence.switchToLightTheme' ],
  'login': [ 'view', 'view.Login' ],
  'message': [ 'view', 'view.Message' ],
  'debugger': [ 'view', 'view.AppDebugger' ],
  'sys': [ 'word', 'word.core.systemMenu' ],
  'logout': [ 'view', 'view.Logout' ],
  'people': [ 'people.word', 'word.feature.People' ],
  'people.new': [ 'word', 'action.new' ],
  'people.list': [ 'view', 'view.People List' ],
};

export interface MenuStoreState {
  locale: Ref<LocaleCode>;
  menuRoot: MenuItem[];
  sysMenuRoot: MenuItem;
}

export interface MenuItem {
  code: string;
  icon?: string;
  title: string;
  targetPath?: string;
  isDivider?: boolean;
  debugUseOnly?: boolean;
  children?: MenuItem[];
}

let useMenuStore = defineStore('Menu', {
  state: ()=><MenuStoreState>({
    locale: ref(LocaleCode.en),
    menuRoot: [
      { code: 'home', title: '..', targetPath: '/', icon: 'home' },
      { code: 'message', title: '..', targetPath: '/message' },
      { code: 'people', title: '..', children: [
        { code: 'people.new', title: '..', targetPath: '/people/creation', icon: 'pen-to-square' },
        { code: 'people.list', title: '..', targetPath: '/people/list', icon: 'list' },
        { code: 'divAfter.people.list', isDivider: true, debugUseOnly: true },
        { code: 'people.33034000003.view', title: 'view 33034000003', targetPath: '/people/item/33034000003/view', debugUseOnly: true },
        { code: 'people.33034000003.edit', title: 'edit 33034000003', targetPath: '/people/item/33034000003/edit', debugUseOnly: true },
        { code: 'people.33034000004.view', title: 'view 33034000004', targetPath: '/people/item/33034000004/view', debugUseOnly: true },
        { code: 'people.33034000005.view', title: 'view 33034000005', targetPath: '/people/item/33034000005/view', debugUseOnly: true },
        { code: 'people.33034000006.view', title: 'view 33034000006', targetPath: '/people/item/33034000006/view', debugUseOnly: true },
      ] },
    ],
    sysMenuRoot: {
      code: 'sys', title: '..',
      children: [
        { code: 'about', title: '..', targetPath: '/about', icon: 'info-circle' },
        { code: 'switchToDarkTheme', title: '..', icon: 'moon' },
        { code: 'switchToLightTheme', title: '..', icon: 'sun' },
        { code: 'divBefore.logout', isDivider: true },
        { code: 'logout', title: '..' },
        { code: 'login', title: '..', targetPath: '/login', debugUseOnly: true },
        { code: 'debugger', title: '..', targetPath: '/debugger', icon: 'bug', debugUseOnly: true },
      ]
    },
  }),
  getters: {
    itemOfKeyMap: function(): PropertyBagWithType<MenuItem> {
      let map: PropertyBagWithType<MenuItem> = {};
      forAllMenuItems(this.menuRoot, (it)=>{
        map[it.code] = it;
      });
      if (this.sysMenuRoot.children) {
        forAllMenuItems(this.sysMenuRoot.children, (it)=>{
          map[it.code] = it;
        });  
      }
      return map;
    },
  },
  actions: {
    init(){
      let PreferenceStore = usePreferenceStore();
      this.setTranslationBundle(PreferenceStore.locale,
        PreferenceStore.i18n);
    },
    setTranslationBundle(locale: LocaleCode, bundle: i18nModel){
      this.locale = locale;
      // redo translation for all menu items
      if (debug) logger?.log('menuStore:setTranslationBundle use i18n:', bundle);
      for (let child of this.menuRoot) {
        translateRecursively(child, i18nLookUp, bundle);
      }
      translateRecursively(this.sysMenuRoot, i18nLookUp, bundle);
    },
  },
});

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

function forAllMenuItems(items: MenuItem[], 
  action: ((_: MenuItem)=>any),
){
  for (let it of items) {
    action(it);
    if (it.children) {
      forAllMenuItems(it.children, action);
    }
  }
}

export { useMenuStore };
