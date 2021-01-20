import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');

console.log(`vue app started using NODE_ENV=${process.env.NODE_ENV}`);
