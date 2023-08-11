import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import MessageView from '@/views/MessageView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/message',
      name: 'message',
      component: MessageView,
    },
    {
      path: '/about',
      name: 'about',
      // defined as lazy-loaded
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/debugger',
      name: 'debugger',
      // defined as lazy-loaded
      component: () => import('@/views/AppDebugger.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // defined as lazy-loaded
      component: () => import('@/views/LoginView.vue'),
    },
  ]
})

export default router;
