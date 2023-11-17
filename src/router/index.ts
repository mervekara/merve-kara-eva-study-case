import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import LoginComponent from '../components/LoginComponent.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginComponent,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
