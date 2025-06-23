import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabaseClient'; // Import Supabase client
import HomeView from '../views/HomePage.vue'
import LoginView from '../views/login/LoginView.vue';
import CheckEmailView from '../views/login/CheckEmailView.vue';
import EmailConfirmedView from '../views/login/EmailConfirmedView.vue'; // Import the email confirmed view
import SignupView from '../views/login/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/check-email',
      name: 'check-email',
      component: CheckEmailView
    },
    {
      path: '/auth/confirmed',
      name: 'email-confirmed',
      component: EmailConfirmedView
    },
    {
      path: '/register',
      name: 'register',
      component: SignupView
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  const isLoggedIn = !!session?.user;

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    next({ name: 'Login', query: { redirectTo: to.fullPath } });
  } else if ((to.name === 'Login' || to.name === 'Signup' || to.name === 'CheckEmail' || to.name === 'PasswordReset' || to.name === 'UpdatePassword') && isLoggedIn) {
    // If user is logged in and tries to access login/signup pages, redirect to home
    next({ name: 'Home' });
  } else {
    next(); // Proceed as normal
  }
});

export default router
