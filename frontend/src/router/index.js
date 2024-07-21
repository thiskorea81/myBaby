import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SignupPage from '@/views/SignupPage.vue';
import AdminPage from '@/views/AdminPage.vue';  // 관리자 페이지 추가

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/signup', name: 'SignUp', component: SignupPage },
  { path: '/admin', name: 'Admin', component: AdminPage },  // 관리자 페이지 라우트 추가
  { path: '/home', name: 'Home', component: HomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
