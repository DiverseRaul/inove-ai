<template>
  <div class="idea-detail-page">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your idea...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <i class="mdi mdi-alert-circle-outline"></i>
        <h2>Idea Not Found</h2>
        <p>{{ error }}</p>
        <RouterLink to="/ideas" class="cta-button">Back to My Ideas</RouterLink>
      </div>

      <!-- Idea Details -->
      <div v-else-if="idea" class="idea-content">
        <h1 class="idea-title">{{ idea.title }}</h1>
        <div class="metadata">
          <span>Created: {{ new Date(idea.created_at).toLocaleDateString() }}</span>
          <span>Last Updated: {{ new Date(idea.updated_at).toLocaleDateString() }}</span>
        </div>
        <div class="idea-body">
          <p>{{ idea.description }}</p>
        </div>
        <div class="actions">
          <button class="cta-button primary">
            <i class="mdi mdi-rocket-launch-outline"></i> Convert to Project
          </button>
          <button class="cta-button secondary">
            <i class="mdi mdi-pencil-outline"></i> Edit Idea
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const route = useRoute();
const idea = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchIdea = async () => {
  try {
    loading.value = true;
    error.value = null;
    const { data, error: fetchError } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', route.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') { // PostgREST error for no rows found
        throw new Error('The idea you are looking for does not exist.');
      } else {
        throw fetchError;
      }
    }

    idea.value = data;
  } catch (err) {
    console.error('Error fetching idea:', err.message);
    error.value = err.message || 'Could not fetch the idea. Please try again later.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchIdea);
</script>

<style scoped>
.idea-detail-page {
  min-height: 100vh;
  background-color: #020207;
  color: #e0e0e0;
  padding: 8rem 2rem 4rem;
}

.container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

/* States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
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

.error-state i {
  font-size: 5rem;
  margin-bottom: 1.5rem;
  color: #ff8a8a;
}

.error-state h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Idea Content */
.idea-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
}

.idea-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(45deg, #E0C3FC, #8EC5FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metadata {
  display: flex;
  gap: 1.5rem;
  color: #9e9e9e;
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
}

.idea-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #b3b3cc;
}

.actions {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1.8rem;
  border-radius: 50px;
  border: none;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cta-button.primary {
  background: linear-gradient(45deg, #6750A4, #8E44AD);
  color: #fff;
}

.cta-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(103, 80, 164, 0.4);
}

.cta-button.secondary {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #b3b3cc;
}

.cta-button.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #8EC5FC;
  color: #fff;
}
</style>
