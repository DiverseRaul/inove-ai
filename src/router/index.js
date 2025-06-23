import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    // Pointing to SignupView, assuming it handles both login and signup
    component: () => import('../views/login/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/login/SignupView.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/login/ProfileView.vue'),
  },
  {
    path: '/check-email',
    name: 'CheckEmail',
    component: () => import('../views/login/CheckEmailView.vue'),
  },
  {
    path: '/email-confirmed',
    name: 'EmailConfirmed',
    component: () => import('../views/login/EmailConfirmedView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
