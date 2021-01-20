<script>
import Vue from 'vue';
import VueRouter from 'vue-router';
import AboutVue from '../views/About.vue';
import HomeVue from '../views/Home.vue';
import MessageVue from '../views/Message.vue';

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

export default router;
</script>
