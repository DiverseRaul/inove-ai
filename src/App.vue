<template>
  <div id="app">
    <Header />
    <main class="main-content">
      <router-view />
    </main>
    <Footer v-if="!$route.meta.hideFooter" />
  </div>
</template>

<script setup>
import Header from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import { useAuth } from './store/session.js';

// Initialize the auth listener to handle user session state across the app
useAuth();
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
