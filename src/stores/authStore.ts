import { Store } from 'vuex';
import { AuthService } from "../service/AuthService";

export const authStore = {
  namespaced: true,
  state: <AuthStoreState>{
    loggedIn: false,
    access_token: '',
  },
  mutations: {
    setLoggedIn(state: AuthStoreState, access_token: string){
      state.loggedIn = true;
      state.access_token = access_token;
    },
    setLoggedOut(state: AuthStoreState){
      state.loggedIn = false;
      state.access_token = '';
    },
  },
  actions: {
    async init(store: Store<AuthStoreState>){
      let authStoreJsonStr = localStorage.getItem('authStore');
      if (!authStoreJsonStr) {
        return;
      }
      let authStoreJson = JSON.parse(authStoreJsonStr);
      if (authStoreJson.loggedIn) {
        store.commit('setLoggedIn', authStoreJson.access_token);
      } else {
        store.commit('setLoggedOut');
      }
    },
    persist(store: Store<AuthStoreState>){
      let authStoreJson = {
        loggedIn: store.state.loggedIn,
        access_token: store.state.access_token,
      };
      localStorage.setItem('authStore', JSON.stringify(authStoreJson));
    },
    async doLogin(store: Store<AuthStoreState>, loginPayload: LoginDto){
      let res = await AuthService().post_login({ body: loginPayload });
      if (!res.access_token) {
        throw new Error('access_token missing in login response.');
      }
      store.commit('setLoggedIn', res.access_token);
      await store.dispatch('persist');
    },
    async doLogout(store: Store<AuthStoreState>){
      store.commit('setLoggedOut', false);
      await store.dispatch('persist');
    },
  },
};

export interface AuthStoreState {
  loggedIn: boolean;
  access_token: string;
}

interface LoginDto {
  username: string;
  password: string;
}
