<template>
  <div class="email-confirmed-container">
    <div class="email-confirmed-card">
      <div class="icon-container success">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64px" height="64px">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h1 class="title">Email Confirmed!</h1>
      <p class="message">
        Your email address has been successfully verified. You can now log in to your account.
      </p>
      <RouterLink to="/login" class="go-to-login-button">Go to Login</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { supabase } from '../../lib/supabaseClient';
import { onUnmounted } from 'vue';

const router = useRouter();

// Supabase handles session creation automatically when the user lands here from the confirmation link.
// We can listen for auth state changes if we need to react to the new session immediately,
// but for just  displaying this page, it's often not necessary to do more here.
// The user is effectively logged in by Supabase at this point if the token was valid.
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in after email confirmation:', session);
    // You could automatically redirect to a dashboard here if desired, e.g.:
    // router.push('/dashboard');
    // For now, we'll let them click the button to go to login.
  }
});

// It's good practice to unsubscribe when the component is unmounted
onUnmounted(() => {
  subscription.unsubscribe();
});

</script>

<style scoped>
.email-confirmed-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-surface-container-lowest, #f0f2f5);
  padding: 2rem;
  font-family: var(--font-family-sans);
}

.email-confirmed-card {
  background-color: var(--color-surface, #ffffff);
  padding: 2.5rem 3rem;
  border-radius: var(--radius-xl, 16px);
  box-shadow: var(--shadow-3, 0 4px 20px rgba(0, 0, 0, 0.08));
  text-align: center;
  max-width: 500px;
  width: 100%;
  animation: fadeInScale 0.5s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.icon-container.success {
  margin-bottom: 1.5rem;
  color: var(--color-success, #4CAF50); /* Success color */
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-on-surface, #1c1b1f);
  margin-bottom: 1rem;
}

.message {
  font-size: 1rem;
  color: var(--color-on-surface-variant, #49454F);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.go-to-login-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary, #673ab7);
  color: var(--color-on-primary, #ffffff);
  border-radius: var(--radius-m, 8px);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.go-to-login-button:hover {
  background-color: var(--color-primary-dark, #512da8);
  transform: translateY(-2px);
}

/* Dark mode considerations */
@media (prefers-color-scheme: dark) {
  .email-confirmed-container {
    background-color: var(--color-surface-container-lowest, #121212);
  }
  .email-confirmed-card {
    background-color: var(--color-surface-container-low, #1e1e1e);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }
  .title {
    color: var(--color-on-surface, #e0e0e0);
  }
  .message {
    color: var(--color-on-surface-variant, #c4c7c5);
  }
  .icon-container.success {
    color: var(--color-success-container-dark, #66bb6a); /* Dark mode success color */
  }
  .go-to-login-button {
    background-color: var(--color-primary, #bb86fc);
    color: var(--color-on-primary, #000000);
  }
  .go-to-login-button:hover {
    background-color: var(--color-primary-dark, #a063f7);
  }
}
</style>
