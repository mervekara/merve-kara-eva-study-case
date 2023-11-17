import { createApp } from 'vue';
import App from './App.vue';
import { store } from './store';
import { createRouter, createWebHistory } from 'vue-router';
import LoginComponent from './components/LoginComponent.vue';
import ChartComponent from './components/ChartComponent.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const routes = [
  { path: '/login', component: LoginComponent },
  { path: '/chart', component: ChartComponent },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(ElementPlus);
app.use(store); // Use the Vuex store
app.use(router); // Use the Vue Router

app.mount('#app');
