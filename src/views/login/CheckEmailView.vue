<template>
  <div class="check-email-container">
    <div class="check-email-card">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="64px" height="64px">
          <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
        </svg>
      </div>
      <h1 class="title">Confirm Your Email</h1>
      <p class="message">
        We've sent a confirmation link to your email address. Please check your inbox (and spam folder, just in case) to complete your registration.
      </p>
      <RouterLink to="/login" class="back-to-login-button">Back to Login</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.check-email-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-surface-container-lowest, #f0f2f5);
  padding: 2rem;
  font-family: var(--font-family-sans);
}

.check-email-card {
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

.icon-container {
  margin-bottom: 1.5rem;
  color: var(--color-primary, #673ab7);
}

.title {
  font-size: 1.75rem; /* Adjusted from 2rem */
  font-weight: 600;
  color: var(--color-on-surface, #1c1b1f);
  margin-bottom: 1rem;
}

.message {
  font-size: 1rem; /* Adjusted from 1.1rem */
  color: var(--color-on-surface-variant, #49454F);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.back-to-login-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary, #673ab7);
  color: var(--color-on-primary, #ffffff);
  border-radius: var(--radius-m, 8px);
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.back-to-login-button:hover {
  background-color: var(--color-primary-dark, #512da8);
  transform: translateY(-2px);
}

/* Dark mode considerations */
@media (prefers-color-scheme: dark) {
  .check-email-container {
    background-color: var(--color-surface-container-lowest, #121212);
  }
  .check-email-card {
    background-color: var(--color-surface-container-low, #1e1e1e);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }
  .title {
    color: var(--color-on-surface, #e0e0e0);
  }
  .message {
    color: var(--color-on-surface-variant, #c4c7c5);
  }
  .icon-container {
    color: var(--color-primary, #bb86fc);
  }
  .back-to-login-button {
    background-color: var(--color-primary, #bb86fc);
    color: var(--color-on-primary, #000000);
  }
  .back-to-login-button:hover {
    background-color: var(--color-primary-dark, #a063f7);
  }
}
</style>
