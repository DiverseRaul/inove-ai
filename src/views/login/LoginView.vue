<template>
  <div class="login-container">
    <div class="floating-shapes-bg">
      <span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="login-card">
      <div class="login-header">
        <h1 class="title-large">Welcome Back</h1>
        <p class="body-medium text-on-surface-variant">Sign in to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div class="input-container" :class="{ 'input-focused': isFocusedEmail }">
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              @focus="isFocusedEmail = true" 
              @blur="isFocusedEmail = false" 
              required
              class="form-input" 
              placeholder="Enter your email"
            />
            <div class="input-highlight"></div>
          </div>
        </div>
        
        <div class="form-group">
          <div class="password-header">
            <label for="password" class="form-label">Password</label>

          </div>
          <div class="input-container" :class="{ 'input-focused': isFocusedPassword }">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              @focus="isFocusedPassword = true" 
              @blur="isFocusedPassword = false" 
              required
              class="form-input" 
              placeholder="Enter your password"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              title="Toggle password visibility"
            >
              <svg v-if="showPassword" class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <svg v-else class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C21.27 9.61 17 6.5 12 6.5c-1.45 0-2.83.32-4.1.89l1.57 1.57C10.74 7.13 11.35 7 12 7zm-1.07 1.07L13 10.14C12.67 10.06 12.34 10 12 10c-1.66 0-3 1.34-3 3 0 .34.06.67.14 1l-2.07 2.07C6.39 15.17 6 14.11 6 13c0-2.76 2.24-5 5-5 .89 0 1.7.24 2.4.64L10.93 8.07zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/>
              </svg>
            </button>
            <div class="input-highlight"></div>
          </div>
        </div>
        
        <div v-if="loginError" class="message-container error-message">
          <p>{{ loginError }}</p>
        </div>
        <button 
          type="submit" 
          class="login-button"
          :class="{ 'button-loading': isLoading }"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="loader"></span>
        </button>
      </form>
      
      <div class="login-divider">
        <span>or continue with</span>
      </div>
      
      <div class="social-login">
        <button class="social-button google" aria-label="Sign in with Google">
          <svg class="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
        </button>
        <button class="social-button github" aria-label="Sign in with GitHub">
          <svg class="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </button>
        <button class="social-button twitter" aria-label="Sign in with Twitter">
          <svg class="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
      </div>
      
      <div class="signup-prompt">
        <p>
          Don't have an account? 
          <RouterLink to="/register" class="signup-link">Create Account</RouterLink>
        </p>
        <p class="forgot-password-prompt">
          <button 
            type="button" 
            class="forgot-password-link-new" 
            @click="handleForgotPassword"
          >
            Forgot Password?
          </button>
        </p>
        <div v-if="forgotPasswordMessage && !loginError" class="message-container info-message">
          <p>{{ forgotPasswordMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useR uter } from 'vue-router';
import { supabase } from '../../lib/supabaseClient';

// Form state
const email = ref('');
const password = ref('');
// const rememberMe = ref(false); // Supabase JS client handles session persistence by default
const showPassword = ref(false);
const isLoading = ref(false);
const loginError = ref<string | null>(null);
const forgotPasswordMessage = ref<string | null>(null);

const router = useRouter();

// Focus state for input animations
const isFocusedEmail = ref(false);
const isFocusedPassword = ref(false);

// Form handlers
const handleLogin = async () => {
  isLoading.value = true;
  loginError.value = null;
  forgotPasswordMessage.value = null; // Clear other messages
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      loginError.value = error.message;
    } else if (data.user) {
      router.push('/'); // Redirect to home page on successful login
    } else {
      loginError.value = 'An unexpected error occurred. Please try again.';
    }
  } catch (err: any) {
    loginError.value = err.message || 'An unexpected error occurred during login.';
  } finally {
    isLoading.value = false;
  }
};

const handleForgotPassword = async () => {
  if (!email.value) {
    forgotPasswordMessage.value = 'Please enter your email address above to reset your password.';
    loginError.value = null; // Clear login error
    return;
  }
  isLoading.value = true;
  loginError.value = null;
  forgotPasswordMessage.value = null;
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/auth/update-password`, 
    });
    if (error) {
      forgotPasswordMessage.value = `Error: ${error.message}`;
    } else {
      forgotPasswordMessage.value = 'Password reset email sent. Please check your inbox (and spam folder).';
    }
  } catch (err: any) {
    forgotPasswordMessage.value = `Error: ${err.message || 'Failed to send password reset email.'}`;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  background: var(--color-background);
  background-size: 400% 400%;
  animation: subtleGradientBG 25s ease infinite;
  overflow: hidden; /* Hide scrollbars if gradient makes page too large */
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  border-radius: var(--radius-xl, 20px); /* More rounded corners */
  background-color: var(--color-surface);
  box-shadow: var(--shadow-3, 0 4px 15px rgba(0,0,0,0.1)); /* Softer shadow */
  animation: fadeIn 0.5s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative; /* Ensure z-index works */
  z-index: 1; /* Above floating shapes */
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-4, 0 8px 25px rgba(0,0,0,0.15)); /* Enhanced shadow on hover */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  margin-bottom: 2rem;
  text-align: center;
}

.login-header h1 {
  color: var(--color-on-surface);
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-on-surface);
  font-weight: 500;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.forgot-password-link {
  font-size: 0.875rem;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  padding: 0;
}

.forgot-password-link:hover {
  color: var(--color-primary-dark, #5d3fd3);
  text-decoration: underline;
}

.input-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-l, 12px); /* More rounded corners */
  border: 1px solid var(--color-outline);
  background-color: var(--color-surface);
  transition: all 0.3s ease;
}

.input-container:hover {
  border-color: var(--color-outline-hover, #6b6b6b);
}

.input-focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(103, 58, 183, 0.25), 0 0 8px rgba(103, 58, 183, 0.15); /* Using direct rgba as --color-primary-rgb might not be defined */
}

.input-highlight {
  position: absolute;
  bottom: 0;
  left: 50%; 
  width: 0%;  
  height: 2px;
  background-color: var(--color-primary);
  transition: width 0.35s ease-out, left 0.35s ease-out; 
  transition: transform 0.3s ease;
  transform-origin: left;
}

.input-focused .input-highlight {
  transform: scaleX(1);
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: none;
  background: transparent;
  color: var(--color-on-surface);
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-small);
  transition: all 0.3s ease;
}

.toggle-password:hover {
  background-color: var(--color-surface-variant);
}

.remember-me {
  display: flex;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 35px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 20px;
  width: 20px;
  border-radius: 4px;
  border: 2px solid var(--color-outline);
  background-color: transparent;
  transition: all 0.3s ease;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--color-primary);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  color: var(--color-on-surface-variant);
  font-size: 0.875rem;
}

.login-button {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-l, 12px); /* More rounded corners */
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease-out;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  background-color: var(--color-primary-dark, #5d3fd3);
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-4, 0 8px 20px rgba(0,0,0,0.15));
}

.login-button:active {
  transform: translateY(-1px) scale(0.98);
  box-shadow: var(--shadow-2, 0 4px 10px rgba(0,0,0,0.1));
}

.button-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: var(--color-on-surface-variant);
  font-size: 0.875rem;
}

.login-divider::before,
.login-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: var(--color-outline-variant);
}

.login-divider span {
  padding: 0 1rem;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px; /* Slightly larger */
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--color-outline-variant);
  background-color: var(--color-surface-container-high, #f0f0f0);
  transition: all 0.2s ease-out;
  cursor: pointer;
  color: var(--color-on-surface-variant);
}

.social-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: var(--shadow-3, 0 6px 15px rgba(0,0,0,0.12));
  border-color: var(--color-primary);
  background-color: var(--color-surface-container-highest, #e8e8e8);
  color: var(--color-primary);
}

.social-button:active {
  transform: translateY(-2px) scale(0.95);
  box-shadow: var(--shadow-1, 0 2px 5px rgba(0,0,0,0.1));
}

.social-icon {
  width: 24px;
  height: 24px;
}

.signup-prompt {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--color-on-surface-variant);
  font-size: 0.9rem;
}

.signup-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.signup-link:hover {
  color: var(--color-primary-dark, #5d3fd3);
  text-decoration: underline;
}

/* Floating Shapes Background */
.floating-shapes-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0; 
}

.floating-shapes-bg span {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: var(--color-primary); /* Primary-like color with alpha */
  animation: float 25s linear infinite;
  bottom: -180px; /* Start off-screen */
  border-radius: 50%;
}

.floating-shapes-bg span:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
.floating-shapes-bg span:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
.floating-shapes-bg span:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
.floating-shapes-bg span:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; border-radius: 10%; background: rgba(103, 58, 183, 0.1); }
.floating-shapes-bg span:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
.floating-shapes-bg span:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; border-radius: 15%; background: rgba(0, 150, 136, 0.1); } /* Secondary-like */
.floating-shapes-bg span:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; background: rgba(255, 193, 7, 0.08); } /* Tertiary-like */
.floating-shapes-bg span:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
.floating-shapes-bg span:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; border-radius: 20%; background: rgba(0, 150, 136, 0.12); }
.floating-shapes-bg span:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; background: rgba(103, 58, 183, 0.07); }

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(-120vh) rotate(720deg); /* Ensure they go well off screen */
    opacity: 0;
  }
}

.forgot-password-prompt {
  margin-top: 0.75rem; 
  text-align: center; 
}

.forgot-password-link-new {
  color: var(--color-on-surface-variant);
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.forgot-password-link-new:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.eye-icon {
  /* currentColor will be inherited from the button's color property */
  /* Size is set directly on SVG element */
}

/* Responsive styles */
@media (max-width: 576px) {
  .login-card {
    padding: 1.5rem;
  }
}

/* Keyframes for background animation */
@keyframes subtleGradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.message-container {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  border: 1px solid transparent;
}

.error-message {
  background-color: var(--color-error-container, #f8d7da);
  color: var(--color-on-error-container, #721c24);
  border-color: var(--color-error, #f5c6cb);
}

.info-message {
  background-color: var(--color-tertiary-container, #e2d9f3);
  color: var(--color-on-tertiary-container, #2c1d41);
  border-color: var(--color-tertiary, #785a9b);
}

/* Dark mode specific styles for gradient */
@media (prefers-color-scheme: dark) {

  .social-button {
    background-color: var(--color-surface-container-high, #2a2a2e);
    color: var(--color-on-surface-variant);
  }

  .social-button:hover {
    background-color: var(--color-surface-container-highest, #35353a);
    color: var(--color-primary);
  }
}
</style>
