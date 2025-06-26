<template>
  <div class="home-page-dark" :class="{ 'scrolled': isScrolled }">
    <section class="hero-section">
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-main-title">
          <span class="hero-title-segment">Welcome</span>
          <span class="hero-title-segment">to</span>
          <span class="hero-title-segment hero-title-brand">
            inove<span class="hero-title-ai">.ai</span>
          </span>
        </h1>
        <p class="tagline hero-tagline">Dream. Plan. Create.</p>
      </div>
    </section>

    <div class="content-section">
      <div v-if="loading" class="loading-state">
        <p>Loading...</p>
      </div>
      <div v-else-if="error" class="error-state">
        <p>Could not load data. Please try again later.</p>
      </div>
      
      <!-- Logged-in View -->
      <div v-else-if="user">
        <div v-if="projects.length > 0 || ideas.length > 0" class="grid-container">
          <!-- Projects Column -->
          <div class="grid-column projects-column">
            <h2 class="section-title"><i class="mdi mdi-rocket-launch-outline"></i> Projects</h2>
            
            <template v-if="projects.length > 0">
              <a v-for="project in projects" :key="project.id" :href="project.url" target="_blank" class="card">
                <div class="card-content">
                  <h3>{{ project.title }}</h3>
                  <p>{{ project.description }}</p>
                </div>
                <span class="card-cta">View Project <i class="mdi mdi-arrow-right"></i></span>
              </a>
            </template>
            
            <div v-else-if="ideas.length > 0" class="card placeholder-card">
              <div class="card-content">
                <h3><i class="mdi mdi-rocket-launch-outline"></i> Ready for the Next Step?</h3>
                <p>You have some great ideas. Turn one into a project to get started.</p>
              </div>
            </div>

            <div class="view-all-container">
              <a href="/projects" class="view-all-btn">View Projects <i class="mdi mdi-arrow-right"></i></a>
            </div>
          </div>
          <!-- Ideas Column -->
          <div class="grid-column ideas-column">
            <h2 class="section-title"><i class="mdi mdi-lightbulb-on-outline"></i> Recent Ideas</h2>
            <RouterLink v-for="idea in ideas" :key="idea.id" :to="`/idea/${idea.id}`" class="card">
              <div class="card-content">
                <h3>{{ idea.title }}</h3>
                <p>{{ idea.description }}</p>
              </div>
              <span class="card-cta">Explore Idea <i class="mdi mdi-arrow-right"></i></span>
            </RouterLink>
            <div class="view-all-container button-group">
              <a href="/create-idea" class="view-all-btn primary-action"><i class="mdi mdi-plus"></i> New Idea</a>
              <a href="/ideas" class="view-all-btn">View Ideas <i class="mdi mdi-arrow-right"></i></a>
            </div>
          </div>
        </div>

        <div v-else class="no-data-container">
          <h2 class="no-data-title"><i class="mdi mdi-creation"></i> Ready to Create?</h2>
          <p class="no-data-subtitle">You haven't created any projects or ideas yet. Let's change that.</p>
          <div class="no-data-actions">
            <a href="/create-idea" class="cta-button primary"><i class="mdi mdi-plus-circle-outline"></i> Create First Idea</a>
            <a href="/projects" class="cta-button secondary"><i class="mdi mdi-rocket-launch-outline"></i> Start a Project</a>
          </div>
        </div>
      </div>

      <!-- Guest View -->
      <div v-else class="guest-view">
        <h2 class="guest-title"><i class="mdi mdi-lock-open-variant-outline"></i> Unlock Your Potential</h2>
        <p class="guest-subtitle">Sign in to manage your projects and ideas, or get started for free.</p>
        <div class="guest-actions">
          <a href="/login" class="cta-button primary"><i class="mdi mdi-login"></i> Sign In</a>
          <a href="/signup" class="cta-button secondary"><i class="mdi mdi-account-plus-outline"></i> Get Started</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { supabase } from '../lib/supabaseClient';

const user = ref(null);
const isScrolled = ref(false);
const projects = ref([]);
const ideas = ref([]);
const loading = ref(true);
const error = ref(null);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

async function fetchData(userId) {
  try {
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(2);

    if (projectsError) throw projectsError;
    projects.value = projectsData;

    const { data: ideasData, error: ideasError } = await supabase
      .from('ideas')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(2);

    if (ideasError) throw ideasError;
    ideas.value = ideasData;

  } catch (e) {
    error.value = e.message;
    console.error('Error fetching data:', e.message);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  const { data: { session } } = await supabase.auth.getSession();
  user.value = session?.user ?? null;

  if (user.value) {
    await fetchData(user.value.id);
  } else {
    loading.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.home-page-dark {
  background-color: #020207; /* Very dark navy, almost black */
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center content horizontally */
  overflow-x: hidden; /* Allow vertical scroll, prevent horizontal */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative; /* For pseudo-elements */
}

/* New background shapes container */
.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

/* Individual shape styling */
.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3; /* Increased base opacity */
  filter: blur(60px); /* Reduced blur to make shapes more defined */
  will-change: transform, opacity, filter;
  transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1),
              opacity 0.5s ease,
              filter 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.shape-1 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #6750A4, transparent 80%);
  top: 10%;
  left: -10%;
  animation: float 20s infinite alternate ease-in-out;
}

.shape-2 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #03DAC6, transparent 60%);
  bottom: 5%;
  right: 10%;
  animation: float 25s infinite alternate ease-in-out 3s; /* Delay start */
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #7D5260, transparent 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 15s infinite ease-in-out;
}

.shape-4 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #4a90e2, transparent 100%);
  top: 0%;
  right: 30%;
  animation: float 18s infinite alternate ease-in-out 1.5s;
}

@keyframes float {
  0% {
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.65; /* Increased opacity */
  }
  100% {
    transform: translateY(-50px) translateX(30px) rotate(20deg);
    opacity: 0.85; /* Increased opacity */
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.65; /* Increased opacity */
  }
  50% {
    transform: translate(-50%, -50%) scale(1.15);
    opacity: 0.8; /* Increased opacity */
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.65; /* Increased opacity */
  }
}


/* Grainy/noise overlay - keep this but adjust z-index */
.home-page-dark::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-repeat: repeat;
    opacity: 0.025;
    pointer-events: none;
    z-index: 1; /* Above shapes, below content */
}

.hero-section {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 2rem;
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-main-title {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 800;
  margin: 0;
  color: #ffffff;
  letter-spacing: -0.02em;
  text-shadow: 0 0 30px rgba(0,0,0,0.3);
}

.tagline {
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 300;
  color: #b3b3cc;
  margin-top: 1rem;
}

/* Text reveal animation */
@keyframes revealText {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-main-title .hero-title-segment,
.hero-tagline {
  display: inline-block;
  opacity: 0;
  animation: revealText 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.hero-main-title .hero-title-segment:nth-child(1) { animation-delay: 0.2s; }
.hero-main-title .hero-title-segment:nth-child(2) { animation-delay: 0.4s; margin-left: 0.25em; }
.hero-main-title .hero-title-segment:nth-child(3) { animation-delay: 0.6s; margin-left: 0.25em; }
.hero-tagline { animation-delay: 1s; }

.hero-title-ai {
  font-weight: 300;
  color: #ffffff;
}

/* Scrolled state adjustments */
.scrolled .shape {
  opacity: 0.95;
  filter: blur(8px);
}

.scrolled .shape-1 {
  transform: translate(40px, -60px) rotate(10deg);
}
.scrolled .shape-2 {
  transform: translate(-50px, 30px) rotate(-10deg);
}
.scrolled .shape-3 {
  transform: translate(-50%, -50%) scale(1.1);
}
.scrolled .shape-4 {
  transform: translate(60px, 40px) rotate(5deg);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-main-title {
    font-size: clamp(2.2rem, 10vw, 4rem); /* Adjust clamp for smaller screens */
  }

  .tagline {
    font-size: clamp(0.9rem, 4vw, 1.2rem); /* Adjust clamp for smaller screens */
  }

  /* Adjust shape sizes and positions for smaller screens */
  .shape {
    filter: blur(60px);
  }
  .shape-1 {
    width: 300px;
    height: 300px;
  }
  .shape-2 {
    width: 250px;
    height: 250px;
  }
  .shape-3 {
    width: 180px;
    height: 180px;
  }
  .shape-4 {
    display: none; /* Hide one shape on smaller screens */
  }
}

@media (max-width: 480px) {
  .hero-main-title {
    font-size: clamp(1.8rem, 12vw, 3rem);
    letter-spacing: -0.01em;
  }

  .tagline {
    font-size: clamp(0.8rem, 5vw, 1rem);
  }
  
  .hero-section {
    padding: 1rem; /* Reduce padding on very small screens */
  }
  
  .shape {
    filter: blur(40px);
  }
  .shape-1 {
    width: 250px;
    height: 250px;
  }
  .shape-2 {
    width: 180px;
    height: 180px;
  }
  .shape-3 {
    display: none;
  }
}

/* New Content Section Styles */
.content-section {
  margin-top: 5rem;
  padding: 4rem 2rem;
  background-color: #020207; /* Match the dark background */
  width: 100%;
  z-index: 2;
  position: relative;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  background: -webkit-linear-gradient(45deg, #E0C3FC, #8EC5FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card {
  position: relative; /* Required for pseudo-elements */
  overflow: hidden; /* Hides the shine effect overflow */
  display: block;
  text-decoration: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), 
              background 0.4s ease, 
              box-shadow 0.4s ease, 
              border-color 0.4s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.card:hover::before {
  left: 150%;
}

.card:hover,
.card:focus {
  transform: translateY(-8px);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
  box-shadow: 0 8px 30px rgba(128, 90, 213, 0.2);
  border-color: rgba(128, 90, 213, 0.5);
  outline: none;
}

.card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.75rem 0;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
}

.card p {
  font-size: 1rem;
  color: #b3b3cc;
  margin: 0;
  line-height: 1.6;
  flex-grow: 1;
}

.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #c9c3e2;
  margin-top: 1.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  background-color: transparent;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.card:hover .card-cta {
  color: #ffffff;
  background-color: rgba(103, 80, 164, 0.4);
  border-color: rgba(103, 80, 164, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(103, 80, 164, 0.2);
}

.placeholder-card {
  border-style: dashed;
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.2);
  background: transparent;
  box-shadow: none;
  text-align: center;
}

.placeholder-card:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(128, 90, 213, 0.5);
}

.placeholder-card h3 {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.cta-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
  /* stroke is inherited from parent color */
}

.view-all-container {
  text-align: center;
  margin-top: 1rem;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.view-all-btn {
  gap: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  font-weight: 500;
  color: #b3b3cc;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50px;
  padding: 0.6rem 1rem;
  transition: all 0.25s ease-in-out;
}

.view-all-btn:hover,
.view-all-btn:focus {
  background-color: rgba(103, 80, 164, 0.2);
  color: #ffffff;
  border-color: rgba(103, 80, 164, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(103, 80, 164, 0.2);
  outline: none;
}

.view-all-btn.primary-action {
  background-color: var(--color-primary, #6750A4);
  color: #ffffff;
  border-color: var(--color-primary, #6750A4);
  font-weight: 600;
}

.view-all-btn.primary-action:hover,
.view-all-btn.primary-action:focus {
  background-color: #7158b1;
  border-color: #7158b1;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(103, 80, 164, 0.35);
}

.view-all-icon {
  width: 17px;
  height: 17px;
  transition: transform 0.25s ease-in-out;
}

.view-all-btn:hover .view-all-icon {
  transform: translateX(3px);
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}

/* No Data and Guest View Styles */
.no-data-container, .guest-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  margin: 0 auto;
  max-width: 800px;
  border-radius: 20px;
  background: rgba(10, 10, 20, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-tagline {
  font-size: 1.5rem;
}

.hero-actions {
  margin-top: 2rem;
}

.profile-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.profile-link-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(128, 90, 213, 0.5);
  box-shadow: 0 4px 15px rgba(128, 90, 213, 0.1);
  transform: translateY(-2px);
}

.profile-link-btn .mdi {
  font-size: 1.5rem;
}

.no-data-title, .guest-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(45deg, #E0C3FC, #8EC5FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.no-data-subtitle, .guest-subtitle {
  font-size: 1.2rem;
  color: #b3b3cc;
  max-width: 500px;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.no-data-actions, .guest-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-button {
  gap: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-width: 180px;
}

.cta-button.primary {
  background-color: #6750A4;
  color: white;
}

.cta-button.primary:hover, .cta-button.primary:focus {
  background-color: #7D5260;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(125, 82, 96, 0.4);
  outline: none;
}

.cta-button.secondary {
  background-color: transparent;
  color: #e0e0e0;
  border-color: rgba(255, 255, 255, 0.3);
}

.cta-button.secondary:hover, .cta-button.secondary:focus {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.7);
  color: white;
  transform: translateY(-3px);
  outline: none;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 2rem;
  text-align: center;
}

.loading-state p {
  color: #b3b3cc;
  font-size: 1.2rem;
}

.error-state p {
  color: #ff8a80; /* Soft red for error text */
  font-size: 1.2rem;
}
</style>
