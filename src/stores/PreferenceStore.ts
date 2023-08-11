import { LocaleCode, getDayJsLocaleName } from "@/model/LocaleCode";
import { i18nBundles, type i18nModel } from "@/translation/i18n";
import { defineStore } from "pinia";
import dayjs from "dayjs";
import { DateUtil } from "@/util/DateUtil";
import { ref, type Ref } from "vue";
import { BrowserApiUtil } from "@/util/BrowserApiUtil";
import type { ILogger } from "@/model/core/ILogger";
import type { ILocalStorage } from "@/model/html/ILocalStorage";
import { ObjectUtil } from "@/util/ObjectUtil";

let debug = !!(+import.meta.env.VITE_PreferenceStore_debug);
const logger: ILogger = console;

const STORAGE_KEY = 'PreferenceStore.state';

const DEFAULT_LONG_DATE_FORMAT_OF_LOCALE: {[key: string]: string} = {};
DEFAULT_LONG_DATE_FORMAT_OF_LOCALE[LocaleCode.en] = "MMMM D (ddd), YYYY";
DEFAULT_LONG_DATE_FORMAT_OF_LOCALE[LocaleCode.zh] = "YYYY年M月D日 (ddd)";
DEFAULT_LONG_DATE_FORMAT_OF_LOCALE[LocaleCode.ja] = "YYYY年M月D日 (ddd)";

const DEFAULT_FULL_DATETIME_FORMAT_OF_LOCALE: {[key: string]: string} = {};
DEFAULT_FULL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.en] = "YYYY-MM-DD (ddd) HH:mm:ss";
DEFAULT_FULL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.zh] = "YYYY-MM-DD (ddd) HH:mm:ss";
DEFAULT_FULL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.ja] = "YYYY-MM-DD (ddd) HH:mm:ss";

const DEFAULT_GENERAL_DATETIME_FORMAT_OF_LOCALE: {[key: string]: string} = {};
DEFAULT_GENERAL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.en] = "YYYY-MM-DD h:mm a";
DEFAULT_GENERAL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.zh] = "YYYY-MM-DD HH:mm";
DEFAULT_GENERAL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.ja] = "YYYY-MM-DD HH:mm";

// note that, these color should match with main.css
const COLOR_PALETTE = {
  DARK_FG_COLOR: '#f0f0f0',
  DARK_BG_COLOR: '#303030',
  LIGHT_FG_COLOR: 'black',
  LIGHT_BG_COLOR: 'whitesmoke',  
};

export interface PreferenceStoreState {
  environmentName: string;
  logoBackgroundColor: string;
  locale: Ref<LocaleCode>;
  i18n: Ref<i18nModel>;
  darkTheme: Ref<boolean>;
  colorPalette: {
    fgColor: Ref<string>;
    bgColor: Ref<string>;
  };
  format: {
    longDateFormat: Ref<string>;
    fullDateTimeFormat: Ref<string>;
    generalDateTimeFormat: Ref<string>;
  };
  auth: {
    tokenRefreshSec: Ref<number>;
  };
  persistenceProvider: ILocalStorage;
}

let usePreferenceStore = defineStore('Preference', {
  state: ()=><PreferenceStoreState>({
    environmentName: import.meta.env.MODE,
    logoBackgroundColor: import.meta.env.VITE_LOGO_BG_COLOR,
    locale: ref(LocaleCode.en),
    i18n: ref(i18nBundles.en),
    darkTheme: ref(false),
    colorPalette: {
      fgColor: ref(COLOR_PALETTE.LIGHT_FG_COLOR),
      bgColor: ref(COLOR_PALETTE.LIGHT_BG_COLOR),
    },
    format: {
      longDateFormat: ref(DEFAULT_LONG_DATE_FORMAT_OF_LOCALE[LocaleCode.en]),
      fullDateTimeFormat: ref(DEFAULT_FULL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.en]),
      generalDateTimeFormat: ref(DEFAULT_GENERAL_DATETIME_FORMAT_OF_LOCALE[LocaleCode.en]),
    },
    auth: {
      tokenRefreshSec: ref(+import.meta.env.VITE_AUTH_REFRESH_SEC || 4),
    },
    persistenceProvider: BrowserApiUtil.getLocalStorage(),
  }),
  getters: {
    formatter(){
      let format = this.format;
      return {
        /**
         * @param date could be dayjs.Dayjs, string of date, 
         * built-in Date or null(for now).
         */
        formatLongDate(date: any){
          return DateUtil.formatDate(date, format.longDateFormat);
        },
        /**
         * @param date could be dayjs.Dayjs, string of date, 
         * built-in Date or null(for now).
         */
        formatFullDateTime(date: any){
          return DateUtil.formatDate(date, format.fullDateTimeFormat);
        },
        /**
         * @param date could be dayjs.Dayjs, string of date, 
         * built-in Date or null(for now).
         */
        formatGeneralDateTime(date: any){
          return DateUtil.formatDate(date, format.generalDateTimeFormat);
        },
      };
    }
  },
  actions: {
    init(){
      let restoredStateJson = this.persistenceProvider.getItem(STORAGE_KEY);
      if (restoredStateJson == null) {
        // default state
        this.setLocale(LocaleCode.en, false);
        this.setTheme(false, false);
      } else {
        let restoredState = JSON.parse(restoredStateJson);
        this.setLocale(restoredState.locale, false);
        this.setTheme(restoredState.darkTheme, false);
        // if (debug) logger?.log('PreferenceStore state restored ', JSON.stringify(this, null, 2));
        if (debug) logger?.log('PreferenceStore state restored, keys =', ObjectUtil.allFields(this));
      }
    },
    setLocale(value: LocaleCode, persist: boolean = true){
      this.locale = value;
      for (let key of Object.keys(i18nBundles)) {
        if (key == value) {
          this.i18n = i18nBundles[value];
        }
      }
      // if (debug) logger?.log(`setLocale(${this.locale}).`);
      if (debug) logger?.log(
        `setLocale(${this.locale}): usePreferenceStore.i18n =`, 
        JSON.stringify(this.i18n, null, 2)
      );
      this.format.longDateFormat = DEFAULT_LONG_DATE_FORMAT_OF_LOCALE[value];
      this.format.fullDateTimeFormat = DEFAULT_FULL_DATETIME_FORMAT_OF_LOCALE[value];
      this.format.generalDateTimeFormat = DEFAULT_GENERAL_DATETIME_FORMAT_OF_LOCALE[value];

      dayjs.locale(getDayJsLocaleName(value));
      if (persist) {
        this.persistState();
      }
    },
    setTheme(darkTheme: boolean, persist: boolean = true) {
      this.darkTheme = darkTheme;
      if (darkTheme) {
        this.colorPalette.fgColor = COLOR_PALETTE.DARK_FG_COLOR;
        this.colorPalette.bgColor = COLOR_PALETTE.DARK_BG_COLOR;  
      } else {
        this.colorPalette.fgColor = COLOR_PALETTE.LIGHT_FG_COLOR;
        this.colorPalette.bgColor = COLOR_PALETTE.LIGHT_BG_COLOR;  
      }
      if (persist) {
        this.persistState();
      }
    },
    persistState(){
      this.persistenceProvider.setItem(STORAGE_KEY, JSON.stringify({
        locale: this.locale,
        darkTheme: this.darkTheme,
      }));
      if (debug) logger?.log(
        'PreferenceStore state persisted storage.length =', this.persistenceProvider.length);
    },
  },
});

export { usePreferenceStore };
