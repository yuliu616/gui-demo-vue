import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import AboutVue from '../views/About.vue';
import HomeVue from '../views/Home.vue';
import MessageVue from '../views/Message.vue';
// import { fixSemanticUiDropdown } from '../util/SemanticFix';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeVue,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutVue,
  },
  {
    path: '/message',
    name: 'Message',
    component: MessageVue,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// router.afterEach((to: Route, from: Route)=>{
//   // initialize code for Semantic UI javascript
//   fixSemanticUiDropdown();
// });

export default router;
