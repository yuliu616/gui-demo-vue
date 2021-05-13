import Vue from 'vue';
import Antd from 'ant-design-vue';
import axios from "axios";

import App from './App.vue';
import Login from './Login.vue';
import router from './router/router-index';
import { rootStore } from './stores/index';
import { AuthProvider } from '@/service/AuthProvider';

import './styles';
import { MessageService } from './service/MessageService';

Vue.config.productionTip = false;

Vue.use(Antd);

new Vue({
  router,
  render: h => h(App),
  store: rootStore,
}).$mount('#app');

new Vue({
  router,
  render: h => h(Login),
  store: rootStore,
}).$mount('#login');

// set up axios
axios.interceptors.request.use(function(req){
  // auto add access token for all api call except auth-service
  // > login call:   /api/auth-service/1.0/login
  // > refresh call: /api/auth-service/1.0/login/refreshToken
  if (req.url) {
    if (!req.url.startsWith('/api/auth-service') ||
      req.url.match('^/api/auth-service/.*/login/refreshToken$')
    ) {
      // console.log('interceptors: req.url =', req.url);
      let access_token = (<any>rootStore.state).authStore.access_token;
      req.headers['authorization']=`Bearer ${access_token}`;  
    }  
  }
  return req;
});
// axios.interceptors.response.use(function(res){
//   return res;
// });
// axios.defaults.timeout = 4500;

// bootstrap
rootStore.dispatch('preferenceStore/init', { root: true });
rootStore.dispatch('menuStore/init', { root: true });
AuthProvider().init();
MessageService().init();

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);
