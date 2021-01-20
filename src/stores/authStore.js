import { AuthService } from "../service/AuthService";
import { message_text } from "../translation/en/message";
import { view_name_text } from "../translation/en/word";
import { MessageType } from "./messageStore";

const authStore = {
  namespaced: true,
  state: {
    loggedIn: false,
    access_token: '',
  },
  mutations: {
    setLoggedIn(state, access_token){
      state.loggedIn = true;
      state.access_token = access_token;
    },
    setLoggedOut(state){
      state.loggedIn = false;
      state.access_token = '';
    },
  },
  actions: {
    async init({ commit }){
      let authStoreJsonStr = localStorage.getItem('authStore');
      if (!authStoreJsonStr) {
        return;
      }
      let authStoreJson = JSON.parse(authStoreJsonStr);
      if (authStoreJson.loggedIn) {
        commit('setLoggedIn', authStoreJson.access_token);
      } else {
        commit('setLoggedOut');
      }
    },
    persist({ state }){
      let authStoreJson = {
        loggedIn: state.loggedIn,
        access_token: state.access_token,
      };
      localStorage.setItem('authStore', JSON.stringify(authStoreJson));
    },
    async doLogin({ commit, dispatch }, loginPayload){
      let res = await AuthService().post_login({ body: loginPayload });
      if (!res.access_token) {
        throw new Error('access_token missing in login response.');
      }
      commit('setLoggedIn', res.access_token);
      await dispatch('persist');
    },
    async doLogout({ commit, dispatch }){
      commit('setLoggedOut', false);
      await dispatch('persist');
    },
  },
};

export { authStore };
