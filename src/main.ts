import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { useAuth } from './store/session'; // Import the auth handler
import './public/style.css';

// Initialize the auth listener to keep the session updated
useAuth();

const app = createApp(App);

app.use(router); // Tell Vue to use the router

app.mount('#app');

