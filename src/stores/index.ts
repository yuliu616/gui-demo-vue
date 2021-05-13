import Vue from 'vue';
import Vuex from 'vuex';

import { authStore } from './authStore';
import { menuStore } from './menuStore';
import { messageStore } from './messageStore';
import { preferenceStore } from './preferenceStore';

Vue.use(Vuex);

let rootStore = new Vuex.Store({
  modules: {
    authStore: <any>authStore,
    menuStore: <any>menuStore,
    messageStore: <any>messageStore,
    preferenceStore: <any>preferenceStore,
  }
});

export { rootStore };
