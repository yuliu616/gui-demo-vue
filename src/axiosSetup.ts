import { type App } from 'vue';
import axios from "axios";
import { useAuthStore } from "./stores/AuthStore";
import type { ILogger } from './model/core/ILogger';

const logger: ILogger = console;

export function useAxios(vueApp: App): App {

  axios.interceptors.request.use(function(req){
    // auto add access token for all api call except auth-service
    // > login call:   /api/auth-service/1.0/login
    // > refresh call: /api/auth-service/1.0/login/refreshToken
    let AuthStore = useAuthStore();
    if (req.url && AuthStore.loggedIn) {
      if (!req.url.startsWith('/api/auth-service') ||
        req.url.match('^/api/auth-service/.*/login/refreshToken$')
      ) {
        // logger?.log('interceptors: req.url =', req.url);
        let access_token = AuthStore.access_token;
        req.headers['authorization']=`Bearer ${access_token}`;  
      }  
    }
    return req;
  });

  axios.defaults.timeout = +import.meta.env.VITE_REST_CALL_TIMEOUT_MS;
  
  return vueApp;
}
