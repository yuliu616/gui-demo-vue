import Vue from 'vue';
import Vuex from 'vuex';

import { authStore } from './authStore';
import { menuStore } from './menuStore';
import { messageStore } from './messageStore';

Vue.use(Vuex);

let rootStore = new Vuex.Store({
  modules: {
    authStore: <any>authStore,
    menuStore: <any>menuStore,
    messageStore: <any>messageStore,
  }
});

export { rootStore };
