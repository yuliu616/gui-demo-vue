import type { ILogger } from "@/model/core/ILogger";
import type { ILocalStorage } from "@/model/html/ILocalStorage";
import { BrowserApiUtil } from "@/util/BrowserApiUtil";
import { ObjectUtil } from "@/util/ObjectUtil";
import dayjs from "dayjs";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

let debug = !!(+import.meta.env.VITE_AuthStore_debug);
const logger: ILogger = console;

const STORAGE_KEY = 'AuthStore.state';

export interface AuthStoreState {
  loggedIn: Ref<boolean>;
  access_token: Ref<string|null>;
  accessLastFetch: Ref<Date|null>;
  persistenceProvider: ILocalStorage;
}

let useAuthStore = defineStore('Auth', {
  state: ()=><AuthStoreState>({
    loggedIn: ref(false),
    access_token: ref(null),
    accessLastFetch: ref(null),
    persistenceProvider: BrowserApiUtil.getLocalStorage(),
  }),
  actions: {
    init(){
      let restoredStateJson = this.persistenceProvider.getItem(STORAGE_KEY);
      if (restoredStateJson != null) {
        let restoredState = JSON.parse(restoredStateJson);
        let lastFetchDj = dayjs(restoredState.accessLastFetch);
        if (lastFetchDj && restoredState.loggedIn) {
          let secSinceLastFetch = dayjs().diff(lastFetchDj, 'second');
          if (secSinceLastFetch <= +import.meta.env.VITE_RESUME_AUTH_LIMIT_SEC) {
            this.loggedIn = restoredState.loggedIn;
            this.access_token = restoredState.access_token;
            this.accessLastFetch = lastFetchDj.toDate();
            if (debug) logger?.log(`auth resumed(time from last fetch=[${secSinceLastFetch}].`);
          } else {
            if (debug) logger?.log(`auth resumption aborted due to time(too long[${secSinceLastFetch}]) exceed limit.`);
          }
        }
        // if (debug) logger?.log('AuthStore state restored ', JSON.stringify(this, null, 2));
        if (debug) logger?.log('AuthStore state restored, keys =', ObjectUtil.allFields(this));
      }
    },
    async onLoginPass(accessToken: string) {
      this.loggedIn = true;
      this.access_token = accessToken;
      this.accessLastFetch = new Date();
      await this.persistState();
    },
    async onTokenRefresh(accessToken: string){
      this.access_token = accessToken;
      this.accessLastFetch = new Date();
      await this.persistState();
    },
    async onLogout(){
      this.loggedIn = false;
      this.access_token = null;
      this.accessLastFetch = null;
      await this.persistState();
    },
    async persistState(){
      this.persistenceProvider.setItem(STORAGE_KEY, JSON.stringify({
        loggedIn: this.loggedIn,
        access_token: this.access_token,
        accessLastFetch: this.accessLastFetch,
      }));
      if (debug) logger?.log(
        'AuthStore state persisted storage.length =', this.persistenceProvider.length);
    },
  },
});

export { useAuthStore };
