import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import SignupPage from '../views/SignupPage.vue';
import HomePage from '../views/HomePage.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/signup', name: 'Signup', component: SignupPage },
  { path: '/home', name: 'Home', component: HomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
