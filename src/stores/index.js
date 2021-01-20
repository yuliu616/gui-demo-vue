import Vue from 'vue';
import Vuex from 'vuex';

import { menuStore } from './menuStore';

Vue.use(Vuex);

let rootStore = new Vuex.Store({
  modules: {
    menuStore: menuStore,
  }
});

// bootstrap
// ...

export { rootStore };
