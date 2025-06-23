<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo -->
        <RouterLink to="/" class="navbar-logo">
          <span class="logo-text">inove<span>.ai</span></span>
        </RouterLink>

        <!-- Auth Actions -->
        <div class="auth-actions">
          <!-- Show Login/Signup if user is not logged in -->
          <template v-if="!userSession">
            <RouterLink to="/login" class="auth-button login-button">Login</RouterLink>
            <RouterLink to="/signup" class="auth-button signup-button">Sign Up</RouterLink>
          </template>
          <!-- Show Profile/Logout if user is logged in -->
          <template v-else>
            <RouterLink to="/profile" class="auth-button login-button">Profile</RouterLink>
            <button @click="handleLogout" class="auth-button signup-button">Logout</button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { userSession } from '../store/session'; // Import the session store
import { supabase } from '../lib/supabaseClient'; // Import the supabase client

const isScrolled = ref(false);
const router = useRouter(); // Get the router instance

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Redirect to home page after logout
    router.push('/');
  } catch (error) {
    alert(error.message);
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Assuming these CSS variables are defined globally or in a style.css */
/*
:root {
  --color-primary: #6750A4; 
  --color-on-primary: #FFFFFF;
  --color-surface-container-highest: #E6E0E9;
  --color-outline: #79747E;
  --color-text: #FFFFFF; 
  --color-text-secondary: #CAC4D0;
  --color-outline-variant: #49454F; 
  --font-family: 'Roboto', sans-serif;
  --font-size-title-large: 1.75rem; 
  --font-size-body-large: 1rem;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px; 
  --shadow-2: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30);
  --transition-fast: 0.2s ease-out;
  --transition-normal: 0.3s ease-out;
}
*/

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(12, 12, 20, 0.6); /* Darker, more transparent */
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(73, 69, 79, 0.5); /* --color-outline-variant with alpha */
  transition: background-color var(--transition-normal), box-shadow var(--transition-normal);
  padding: 0 var(--spacing-md); /* Add horizontal padding to navbar itself */
}

.navbar-scrolled {
  background-color: rgba(12, 12, 20, 0.7); /* Slightly less transparent on scroll */
  box-shadow: var(--shadow-2);
}

.container {
  width: 100%;
  max-width: 1200px; /* Or your preferred max-width */
  margin: 0 auto;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px; /* Fixed height for the navbar */
}

.navbar-logo {
  text-decoration: none;
  transition: color var(--transition-fast);
}

.logo-text {
  color: var(--color-text, #FFFFFF); /* Fallback if var not defined */
  font-family: var(--font-family, 'Segoe UI', sans-serif);
  font-size: clamp(1.5rem, 4vw, 2rem); /* Responsive font size */
  font-weight: 700;
}

.logo-text span {
  font-weight: 300; /* Lighter for '.ai' */
  color: var(--color-primary, #A188E2); /* Accent color for .ai */
}

.auth-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md, 16px);
}

.auth-button {
  text-decoration: none;
  padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
  border-radius: var(--radius-lg, 20px); /* More rounded buttons */
  font-weight: 500;
  font-size: var(--font-size-body-large, 0.9rem);
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
}

.login-button {
  color: var(--color-text-secondary, #CAC4D0);
  background-color: transparent;
}

.login-button:hover {
  color: var(--color-text, #FFFFFF);
  background-color: rgba(255, 255, 255, 0.1);
}

.signup-button {
  color: var(--color-on-primary, #FFFFFF);
  background-color: var(--color-primary, #6750A4);
  border-color: var(--color-primary, #6750A4);
}

.signup-button:hover {
  background-color: color-mix(in srgb, var(--color-primary, #6750A4) 90%, black);
  border-color: color-mix(in srgb, var(--color-primary, #6750A4) 90%, black);
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .navbar-content {
    height: 80px;
  }
  .logo-text {
    font-size: 1.5rem;
  }
  .auth-button {
    padding: 10px 12px;
    font-size: 1.05rem;
  }
  .auth-actions {
    gap: var(--spacing-sm, 8px);
  }
}

@media (max-width: 480px) {
  .navbar-logo {
    flex-grow: 1; /* Allow logo to take space if buttons wrap or shrink */
  }
  .auth-button {
    padding: var(--spacing-sm, 5px) var(--spacing-sm, 10px);
    font-size: 0.9rem;
  }
  .auth-actions {
    gap: calc(var(--spacing-sm, 8px) / 2);
  }
}
</style>
