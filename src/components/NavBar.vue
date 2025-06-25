<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
    <div class="container">
      <div class="navbar-content">
        <RouterLink to="/" class="navbar-logo">
          <span class="logo-text">inove<span>.ai</span></span>
        </RouterLink>

        <!-- Nav Links for logged-in users -->
        <div class="spacer"></div>

        <div class="nav-right" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
          <!-- Nav Links for logged-in users -->
          <div v-if="userSession" class="nav-links">
            <RouterLink to="/" class="nav-link" @click="closeMobileMenu">Home</RouterLink>
            <RouterLink to="/projects" class="nav-link" @click="closeMobileMenu">Projects</RouterLink>
            <RouterLink to="/ideas" class="nav-link" @click="closeMobileMenu">Ideas</RouterLink>
          </div>

          <!-- Auth Actions -->
          <div class="auth-actions">
          <template v-if="!userSession">
            <RouterLink to="/login" class="auth-button login-button">Sign In</RouterLink>
            <RouterLink to="/signup" class="auth-button signup-button">Get Started</RouterLink>
          </template>
          <template v-else>
            <div class="profile-dropdown" ref="dropdownRef">
              <button @click="toggleDropdown" class="avatar-button">
                <span>{{ userInitial }}</span>
              </button>
              <div v-if="isDropdownOpen" class="dropdown-menu">
                <div class="dropdown-header">
                  <p class="username">{{ username }}</p>
                  <p class="email">{{ userSession.user.email }}</p>
                </div>
                <RouterLink to="/profile" @click="isDropdownOpen = false" class="dropdown-item">
                  <i class="mdi mdi-account-circle-outline"></i> Profile
                </RouterLink>
                <button @click="handleLogout" class="dropdown-item">
                  <i class="mdi mdi-logout"></i> Logout
                </button>
              </div>
            </div>
          </template>
          </div>
        </div>

        <button class="mobile-nav-toggle" @click="toggleMobileMenu" aria-label="Toggle navigation">
          <i class="mdi" :class="isMobileMenuOpen ? 'mdi-close' : 'mdi-menu'"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { userSession } from '../store/session';
import { supabase } from '../lib/supabaseClient';

const isScrolled = ref(false);
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const dropdownRef = ref(null);
const router = useRouter();

const username = computed(() => userSession.value?.user?.user_metadata?.username || 'User');
const userInitial = computed(() => (username.value ? username.value[0].toUpperCase() : 'A'));

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = async () => {
  isDropdownOpen.value = false;
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert(error.message);
  } else {
    router.push('/');
  }
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background-color: rgba(12, 12, 20, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(73, 69, 79, 0.5);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  padding: 0 1rem;
}
.navbar-scrolled {
  background-color: rgba(12, 12, 20, 0.7);
  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
}
.container { width: 100%; max-width: 1200px; margin: 0 auto; }
.navbar-content { display: flex; align-items: center; height: 70px; }
.navbar-logo { text-decoration: none; }
.logo-text { color: #fff; font-family: 'Segoe UI', sans-serif; font-size: 1.8rem; font-weight: 700; }
.logo-text span { font-weight: 300; }

.nav-right {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-link {
  position: relative;
  color: #CAC4D0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  padding-bottom: 5px;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #E0C3FC;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease-out;
}

.nav-link:hover, 
.nav-link.router-link-exact-active {
  color: #fff;
}

.nav-link:hover::after,
.nav-link.router-link-exact-active::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.spacer { flex-grow: 1; }

.auth-actions { display: flex; align-items: center; gap: 1rem; }
.auth-button { text-decoration: none; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 500; transition: all 0.2s ease; border: 1px solid transparent; cursor: pointer; }
.login-button { color: #CAC4D0; background-color: transparent; }
.login-button:hover { color: #fff; background-color: rgba(255, 255, 255, 0.1); }
.signup-button { color: #fff; background-color: #6750A4; }
.signup-button:hover { background-color: #5A4492; }

.profile-dropdown { position: relative; }
.avatar-button {
  width: 40px; height: 40px;
  border-radius: 50%;
  background-color: #6750A4;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 600;
  transition: all 0.2s ease;
}
.avatar-button:hover { transform: scale(1.1); box-shadow: 0 0 15px rgba(103, 80, 164, 0.7); }

.dropdown-menu {
  position: absolute;
  top: 55px;
  right: 0;
  background-color: #1c1b22;
  border-radius: 12px;
  border: 1px solid #49454F;
  box-shadow: 0 5px 25px rgba(0,0,0,0.3);
  width: 240px;
  overflow: hidden;
  z-index: 1100;
}
.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid #49454F;
}
.dropdown-header .username { font-weight: 600; color: #fff; margin: 0; }
.dropdown-header .email { font-size: 0.85rem; color: #CAC4D0; margin: 0; }

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #CAC4D0;
  text-decoration: none;
  background: none; border: none; width: 100%; text-align: left; font-size: 1rem; cursor: pointer;
}
.dropdown-item:hover { background-color: rgba(103, 80, 164, 0.3); color: #fff; }
.dropdown-item .mdi { font-size: 1.2rem; }

.mobile-nav-toggle {
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1200;
}

@media (max-width: 992px) {
  .mobile-nav-toggle {
    display: block;
  }

  .nav-right {
    position: fixed;
    top: 70px; /* Height of navbar */
    right: -100%;
    width: 100%;
    height: calc(100vh - 70px);
    background-color: #0c0c14;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 3rem;
    gap: 2rem;
    transition: right 0.4s ease-in-out;
  }

  .nav-right.mobile-menu-open {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    font-size: 1.5rem;
  }

  .auth-actions {
    flex-direction: column;
    gap: 1.5rem;
  }

  .profile-dropdown {
    order: -1; /* Move avatar to the top */
  }
}
</style>
