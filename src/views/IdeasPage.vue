<template>
  <div class="ideas-page">
    <div class="container">
      <h1 class="page-title">
        <i class="mdi mdi-lightbulb-on-outline"></i> My Ideas
      </h1>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your ideas...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="mdi mdi-alert-circle-outline"></i>
        <p>Oops! Something went wrong.</p>
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="ideas.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="mdi mdi-thought-bubble-outline"></i>
        </div>
        <h2>No Ideas Yet</h2>
        <p>Your brilliant ideas will appear here. Let's create the first one!</p>
        <RouterLink to="/create-idea" class="cta-button">
          <i class="mdi mdi-plus"></i> Create New Idea
        </RouterLink>
      </div>

      <!-- Ideas Grid -->
      <div v-else class="ideas-grid">
        <div v-for="idea in ideas" :key="idea.id" class="idea-card">
          <h3 class="idea-title">{{ idea.title }}</h3>
          <p class="idea-description">{{ idea.description }}</p>
          <div class="card-footer">
             <span class="last-updated">
              <i class="mdi mdi-clock-outline"></i>
              Updated {{ new Date(idea.updated_at).toLocaleDateString() }}
            </span>
            <RouterLink :to="`/idea/${idea.id}`" class="view-idea-button">
              Develop Idea <i class="mdi mdi-arrow-right"></i>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { userSession } from '../store/session';
import { RouterLink } from 'vue-router';

const ideas = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchIdeas = async () => {
  if (!userSession.value?.user) {
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    error.value = null;

    const { data, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userSession.value.user.id)
      .order('updated_at', { ascending: false });

    if (fetchError) throw fetchError;

    ideas.value = data;
  } catch (err) {
    console.error('Error fetching ideas:', err.message);
    error.value = 'Could not fetch your ideas. Please try again later.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (userSession.value) {
    fetchIdeas();
  } else {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
        userSession.value = session;
        fetchIdeas();
        authListener.subscription.unsubscribe();
      }
    });
  }
});
</script>

<style scoped>
/* Using similar styles to ProjectsPage for consistency */
.ideas-page {
  min-height: 100vh;
  background-color: #020207;
  color: #e0e0e0;
  padding: 8rem 2rem 4rem;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: -webkit-linear-gradient(45deg, #E0C3FC, #8EC5FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* States */
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
}

.loading-state .spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top-color: #E0C3FC;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state i, .empty-state .empty-icon i {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  color: #8EC5FC;
}

.error-state .error-message {
  color: #ff8a8a;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.empty-state h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: #b3b3cc;
  margin-bottom: 2rem;
}

.empty-state .cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  background: linear-gradient(45deg, #6750A4, #8E44AD);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.empty-state .cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(103, 80, 164, 0.4);
}

/* Ideas Grid */
.ideas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
}

.idea-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  min-height: 280px;
}

.idea-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border-color: rgba(224, 195, 252, 0.5);
}

.idea-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1rem 0;
}

.idea-description {
  color: #b3b3cc;
  font-size: 1rem;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  margin-top: auto;
}

.last-updated {
  font-size: 0.9rem;
  color: #9e9e9e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-idea-button {
  color: #E0C3FC;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.view-idea-button:hover {
  color: #fff;
  transform: translateX(5px);
}
</style>
