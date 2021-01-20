import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";

import { authStore } from './authStore';
import { menuStore } from './menuStore';
import { messageStore } from './messageStore';

Vue.use(Vuex);

let rootStore = new Vuex.Store({
  modules: {
    authStore: authStore,
    menuStore: menuStore,
    messageStore: messageStore,
  }
});

// set up axios
axios.interceptors.request.use(function(req){
  // auto add access token for all api call except auth-service
  if (!req.url.startsWith('/api/auth-service')) {
    // console.log('interceptors: req.url =', req.url);
    let access_token = rootStore.state.authStore.access_token;
    req.headers['authorization']=`Bearer: ${access_token}`;  
  }
  return req;
});

// bootstrap
rootStore.dispatch('authStore/init');
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
