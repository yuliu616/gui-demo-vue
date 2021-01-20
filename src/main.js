import Vue from 'vue';
import App from './App.vue';
import Sidebar from './Sidebar.vue';
import router from './router/router-index.vue';
import { rootStore } from './stores/index';

import 'semantic-ui-css/semantic.min.css';

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

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);
