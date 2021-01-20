import Vue from 'vue';
import Vuex from 'vuex';

import { menuStore } from './menuStore';
import { messageStore } from './messageStore';

Vue.use(Vuex);

let rootStore = new Vuex.Store({
  modules: {
    menuStore: menuStore,
    messageStore: messageStore,
  }
});

// bootstrap
rootStore.dispatch('messageStore/init');

// add dummy messages
//  rootStore.dispatch('messageStore/add', {
//    viewName: 'People Admin', text: "People record created."
//  });
//  rootStore.dispatch('messageStore/add', {
//    viewName: 'People Admin', text: "Record updated."
//  });
//  rootStore.dispatch('messageStore/add', {
//    viewName: 'Region Admin', text: "Please specify a home address."
//  });
//  rootStore.dispatch('messageStore/add', {
//    viewName: 'Region Admin', text: "Home address assigned to people."
//  });

export { rootStore };
