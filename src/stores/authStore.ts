import { Store } from 'vuex';

export const authStore = {
  namespaced: true,
  state: <AuthStoreState>{
    loggedIn: false,
    access_token: '',
    accessLastFetch: null,
  },
  mutations: {
    setLoggedIn(state: AuthStoreState, access_token: string){
      state.loggedIn = true;
      state.access_token = access_token;
      state.accessLastFetch = new Date();
    },
    setLastFetch(state: AuthStoreState, accessLastFetch: Date){
      state.accessLastFetch = accessLastFetch;
    },
    updateToken(state: AuthStoreState, access_token: string){
      state.access_token = access_token;
      state.accessLastFetch = new Date();
    },
    setLoggedOut(state: AuthStoreState){
      state.loggedIn = false;
      state.access_token = '';
      state.accessLastFetch = null;
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
        store.commit('setLastFetch', new Date(authStoreJson.accessLastFetch));
      } else {
        store.commit('setLoggedOut');
      }
    },
    persist(store: Store<AuthStoreState>){
      let authStoreJson = {
        loggedIn: store.state.loggedIn,
        access_token: store.state.access_token,
        accessLastFetch: store.state.accessLastFetch,
      };
      localStorage.setItem('authStore', JSON.stringify(authStoreJson));
    },
    async onLoginPass(store: Store<AuthStoreState>, accessToken: string){
      store.commit('setLoggedIn', accessToken);
      await store.dispatch('persist');
    },
    async onTokenRefresh(store: Store<AuthStoreState>, accessToken: string){
      store.commit('updateToken', accessToken);
      await store.dispatch('persist');
    },
    async onLogout(store: Store<AuthStoreState>){
      store.commit('setLoggedOut', false);
      await store.dispatch('persist');
    },
  },
};

export interface AuthStoreState {
  loggedIn: boolean;
  access_token: string;
  accessLastFetch: Date|null;
}

interface LoginDto {
  username: string;
  password: string;
}
