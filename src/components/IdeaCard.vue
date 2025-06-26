<template>
  <div class="idea-card">
    <div class="card-header">
      <span class="card-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1V21c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V6.5L15.5 2z"/><path d="M3 7.6v12.8c0 .6.4 1 1 1h12"/><path d="M15 2v5h5"/></svg>
      </span>
      <h3 class="card-title">{{ title }}</h3>
    </div>
    <div class="card-body">
      <p class="card-description">{{ description }}</p>
      <button @click="$emit('expand-idea', { title, description })" class="create-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m-7-7h14"/></svg>
        <span>Create</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 1rem;
}

.create-btn {
  background: linear-gradient(45deg, #805AD5, #D69E2E);
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(128, 90, 213, 0.4);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(128, 90, 213, 0.5);
}

.idea-card {
  background-color: #2c2c2e;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 90%;
  align-self: flex-start;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.idea-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #E0C3FC;
}

.card-icon {
  flex-shrink: 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.card-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #b3b3cc;
  margin: 0;
}
</style>
