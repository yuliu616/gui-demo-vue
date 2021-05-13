import { LocaleCode } from '@/model/Locale';
import { i18nBundles, i18nModel } from '@/translation/i18n';
import { Store } from 'vuex';
import moment from 'moment';
import { getMomentLocaleName } from '@/model/Locale';

export const preferenceStore = {
  namespaced: true,
  state: <PreferenceStoreState>{
    environmentName: process.env.NODE_ENV,
    showProdLogo: process.env.VUE_APP_LOGO_USE=='PROD',
    showDevLogo: process.env.VUE_APP_LOGO_USE=='DEV',
    logoBackgroundColor: process.env.VUE_APP_LOGO_BG_COLOR,
    auth: {
      tokenRefreshSec: +process.env.VUE_APP_AUTH_REFRESH_SEC || 4,
    },
    locale: LocaleCode.zh,
    i18n: i18nBundles.zh,
  },
  mutations: {
    setLocale(state: PreferenceStoreState, value: LocaleCode){
      state.locale = value;
      for (let key of Object.keys(i18nBundles)) {
        if (key == value) {
          state.i18n = i18nBundles[value];
        }
      }
    },
  },
  actions: {
    async init(store: Store<PreferenceStoreState>){
      let preferenceStoreJsonStr = localStorage.getItem('preferenceStore');
      if (preferenceStoreJsonStr) {
        let restored = <LocalPersistedState>JSON.parse(preferenceStoreJsonStr);
        store.dispatch('changeLocale', <LocaleCode>restored.localeCode);
      }
    },
    async persist(store: Store<PreferenceStoreState>){
      let toBePersisted: LocalPersistedState = {
        localeCode: store.state.locale,
      };
      localStorage.setItem('preferenceStore', JSON.stringify(toBePersisted));
    },
    async changeLocale(store: Store<PreferenceStoreState>, value: LocaleCode){
      store.commit('setLocale', value);
      store.commit('menuStore/setTranslationBundle', store.state.i18n, { root: true });
      moment.locale(getMomentLocaleName(value));
      await store.dispatch('persist');
    },
  },
}

export interface PreferenceStoreState {
  environmentName: string;
  showProdLogo: boolean;
  showDevLogo: boolean;
  logoBackgroundColor: string;
  locale: LocaleCode;
  i18n: i18nModel;
  auth: {
    tokenRefreshSec: number;
  };
}

interface LocalPersistedState {
  localeCode: string;
}

export {
  i18nModel,
}