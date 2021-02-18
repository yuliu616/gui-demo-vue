import Vue from 'vue';
import jQuery from 'jquery';
import App from './App.vue';
import Sidebar from './Sidebar.vue';
import Login from './Login.vue';
import router from './router/router-index.vue';
import { rootStore } from './stores/index';

import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui-css/semantic.js';
import 'toastr/build/toastr.min.css';
import 'vue2-datepicker/index.css'

// make jquery global symbols
window.$ = jQuery;
window.jQuery = jQuery;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  store: rootStore,
}).$mount('#app');

new Vue({
  router,
  render: h => h(Sidebar),
  store: rootStore,
}).$mount('#sidebar');

new Vue({
  router,
  render: h => h(Login),
  store: rootStore,
}).$mount('#login');

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);
