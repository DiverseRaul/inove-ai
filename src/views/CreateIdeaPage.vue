<template>
  <div class="create-idea-page">
    <div class="prompt-container">
      <h1 class="page-title">Create a New Idea</h1>
      <p class="page-subtitle">Let AI help you brainstorm and flesh out your next big project.</p>
      
      <div class="prompt-form">
        <textarea
          v-model="ideaPrompt"
          class="prompt-textarea"
          placeholder="Describe your idea... for example, 'A mobile app that helps users find local hiking trails with real-time weather updates.'"
        ></textarea>
        
        <div class="form-actions">
          <button @click="generateIdea" class="generate-btn" :disabled="isGenerating">
            <span v-if="!isGenerating">Generate</span>
            <span v-else>Generating...</span>
            <svg v-if="!isGenerating" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          </button>

          <div class="model-selector">
            <button @click="toggleDropdown" class="dropdown-btn">
              <span>{{ selectedModel.name }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <transition name="fade">
              <div v-if="isDropdownOpen" class="dropdown-menu">
                <a v-for="model in models" :key="model.name" @click="selectModel(model)" class="dropdown-item">
                  <span>{{ model.name }}</span>
                  <svg v-if="model.isPremium" class="crown-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>
                </a>
              </div>
            </transition>
          </div>

          <button @click="openSettingsModal" class="settings-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
          </button>
        </div>
      </div>

      <div v-if="generatedResult" class="result-container">
        <h2 class="result-title">Generated Idea</h2>
        <div class="result-content">
          <p>{{ generatedResult }}</p>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <transition name="modal-fade">
      <div v-if="isSettingsModalOpen" class="modal-overlay" @click.self="closeSettingsModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Generation Settings</h2>
            <button @click="closeSettingsModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="setting-group">
              <label class="setting-label">Credit Usage</label>
              <div class="segmented-control">
                <button
                  v-for="option in creditOptions"
                  :key="option"
                  :class="{ active: creditUsage === option }"
                  @click="creditUsage = option"
                >
                  {{ option }}
                </button>
              </div>
            </div>
            <div class="setting-group">
              <label class="setting-label">Creativity</label>
              <div class="segmented-control">
                <button
                  v-for="option in creativityOptions"
                  :key="option"
                  :class="{ active: creativityLevel === option }"
                  @click="creativityLevel = option"
                >
                  {{ option }}
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeSettingsModal" class="save-btn">Done</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Premium Modal -->
    <transition name="modal-fade">
      <div v-if="isPremiumModalOpen" class="modal-overlay" @click.self="closePremiumModal">
        <div class="modal-content premium-modal">
          <div class="modal-header">
            <h2 class="modal-title">Premium Feature</h2>
            <button @click="closePremiumModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="premium-text">The 'Pro' model offers the highest quality generation and is available exclusively to our premium subscribers. Upgrade now to unlock the best results.</p>
          </div>
          <div class="modal-footer">
            <button @click="closePremiumModal" class="upgrade-btn">Upgrade to Premium</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { userSession } from '../store/session';

const ideaPrompt = ref('');
const generatedResult = ref('');
const isGenerating = ref(false);

// Dropdown state
const models = ref([
  { name: 'Pro', isPremium: true },
  { name: 'Flash', isPremium: false },
  { name: 'Lite', isPremium: false },
]);
const selectedModel = ref(models.value[1]); // Default to 'Flash'
const isDropdownOpen = ref(false);

// Modals state
const isSettingsModalOpen = ref(false);
const isPremiumModalOpen = ref(false);

// Settings state
const creditOptions = ['Low', 'Medium', 'High'];
const creativityOptions = ['Low', 'Medium', 'High'];
const creditUsage = ref('Medium');
const creativityLevel = ref('Medium');

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectModel = (model) => {
  if (model.isPremium) {
    openPremiumModal();
  } else {
    selectedModel.value = model;
  }
  isDropdownOpen.value = false;
};

const openSettingsModal = () => { isSettingsModalOpen.value = true; };
const closeSettingsModal = () => { isSettingsModalOpen.value = false; };
const openPremiumModal = () => { isPremiumModalOpen.value = true; };
const closePremiumModal = () => { isPremiumModalOpen.value = false; };

const generateIdea = async () => {
  if (!ideaPrompt.value.trim() || !userSession.value?.user) return;

  isGenerating.value = true;
  generatedResult.value = '';

  try {
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    const title = `New Idea: ${ideaPrompt.value.substring(0, 30)}...`;
    const description = `Based on your prompt for "${ideaPrompt.value}", this is a generated idea using the ${selectedModel.value.name} model. (Simulated AI response).`;

    const { data, error } = await supabase
      .from('ideas')
      .insert([
        {
          user_id: userSession.value.user.id,
          title: title,
          description: description,
          // You can add more fields here, like the model used, creativity settings, etc.
        },
      ])
      .select();

    if (error) throw error;

    generatedResult.value = description;

  } catch (err) {
    console.error('Error generating or saving idea:', err.message);
    generatedResult.value = 'Failed to generate or save idea. Please try again.';
  } finally {
    isGenerating.value = false;
  }
};
</script>

<style scoped>
.create-idea-page {
  min-height: 100vh;
  padding: 8rem 2rem 4rem;
  background: #0D1117;
  background: radial-gradient(ellipse at bottom, #121820 0%, #040508 100%);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.prompt-container { max-width: 800px; width: 100%; text-align: center; }
.page-title { font-size: 3rem; font-weight: 700; background: -webkit-linear-gradient(45deg, #E0C3FC, #8EC5FC); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
.page-subtitle { font-size: 1.2rem; color: #a0a0c0; max-width: 600px; margin: 0 auto 3.5rem; line-height: 1.6; }
.prompt-form { position: relative; }

.prompt-textarea {
  width: 100%;
  min-height: 160px;
  padding: 1.5rem;
  font-family: inherit;
  font-size: 1.1rem;
  color: #e0e0e0;
  background: rgba(13, 17, 23, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  resize: vertical;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.prompt-textarea:focus { outline: none; border-color: #8E2DE2; box-shadow: 0 0 0 3px rgba(142, 45, 226, 0.3); }

.form-actions { display: flex; justify-content: center; align-items: stretch; gap: 0.75rem; width: 70%; margin: 2rem auto 0; }

.generate-btn, .dropdown-btn, .settings-btn {
  padding: 0.8rem; border-radius: 12px; font-weight: 600; transition: all 0.3s ease-in-out; border: 1px solid rgba(255, 255, 255, 0.15);
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer; background: rgba(255, 255, 255, 0.08); color: #c0c0e0;
}

.generate-btn {
  gap: 0.75rem; padding-left: 1.5rem; padding-right: 1.5rem; color: #ffffff;
  background: linear-gradient(to right, #6f42c1 0%, #8E2DE2 50%, #6f42c1 100%);
  background-size: 200% auto;
  border-color: #6f42c1; box-shadow: 0 4px 15px rgba(111, 66, 193, 0.2); flex-grow: 3;
  transition: all 0.4s ease-out;
}

.generate-btn:hover:not(:disabled) {
  background-position: right center;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(111, 66, 193, 0.4);
}

.generate-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; transform: none; }

.model-selector { position: relative; display: flex; flex-grow: 2; }
.dropdown-btn { width: 100%; gap: 0.5rem; }
.dropdown-btn:hover, .settings-btn:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }
.settings-btn { flex-grow: 0; flex-shrink: 0; width: 50px; }

.dropdown-menu { position: absolute; bottom: calc(100% + 8px); left: 0; right: 0; background: #161b22; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; padding: 0.5rem; z-index: 10; box-shadow: 0 12px 40px rgba(0,0,0,0.3); backdrop-filter: blur(10px); min-width: 150px; }
.dropdown-item { display: flex; justify-content: center; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; color: #b3b3cc; cursor: pointer; border-radius: 8px; transition: background-color 0.2s ease, color 0.2s ease; }
.dropdown-item:hover { background-color: #6f42c1; color: #ffffff; }
.crown-icon { color: #FFD700; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

.result-container { margin-top: 4rem; padding: 2rem; background: rgba(13, 17, 23, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; text-align: left; backdrop-filter: blur(10px); }
.result-title { font-size: 1.5rem; font-weight: 600; color: #E0C3FC; margin-bottom: 1rem; }
.result-content p { font-size: 1.1rem; line-height: 1.7; color: #c0c0e0; }

/* Modal Styles */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px); }
.modal-content { background: #161b22; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 2rem; width: 90%; max-width: 500px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.modal-title { font-size: 1.5rem; font-weight: 600; color: #E0C3FC; }
.close-btn { background: none; border: none; color: #a0a0c0; cursor: pointer; padding: 0; transition: color 0.2s ease; }
.close-btn:hover { color: #ffffff; }

.modal-body { display: flex; flex-direction: column; gap: 2rem; }
.setting-group { text-align: left; }
.setting-label { display: block; font-size: 1rem; font-weight: 500; color: #c0c0e0; margin-bottom: 1rem; }

.segmented-control { display: flex; background: rgba(13, 17, 23, 0.8); border-radius: 10px; padding: 4px; }
.segmented-control button { flex: 1; padding: 0.75rem; background: transparent; border: none; color: #a0a0c0; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; }
.segmented-control button.active { background: #6f42c1; color: #ffffff; box-shadow: 0 2px 10px rgba(111, 66, 193, 0.3); }

.modal-footer { margin-top: 2.5rem; text-align: right; }
.save-btn { padding: 0.8rem 2rem; background: #6f42c1; border: none; border-radius: 10px; color: #ffffff; font-weight: 600; cursor: pointer; transition: background-color 0.2s ease; }
.save-btn:hover { background: #8E2DE2; }

/* Premium Modal Specifics */
.premium-modal .modal-title { color: #FFD700; }
.premium-text { color: #c0c0e0; line-height: 1.6; margin: 0; text-align: center; }
.upgrade-btn { width: 100%; padding: 1rem; background: linear-gradient(to right, #FFD700, #FFA500); border: none; border-radius: 10px; color: #161b22; font-weight: 700; cursor: pointer; transition: all 0.3s ease; }
.upgrade-btn:hover { transform: scale(1.03); box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3); }
</style>
