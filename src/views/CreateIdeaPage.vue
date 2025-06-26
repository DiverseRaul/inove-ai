<template>
  <div class="create-idea-page">
    <langflow-chat
      window_title="inove.ai"
      flow_id="74f55130-bb9c-47b5-b3d7-af3ca14158cc"
      host_url="https://astra.datastax.com">
    </langflow-chat>
    <div class="chat-display-area">
      <div v-if="chatHistory.length === 0 && !isGenerating" class="placeholder-area">
        <div class="placeholder-content">
          <h1 class="placeholder-title">Create a New Idea</h1>
          <p class="placeholder-subtitle">Start a conversation with the AI to brainstorm and develop your ideas.</p>
        </div>
      </div>
      <div v-else class="chat-history">
        <template v-for="(message, index) in chatHistory" :key="index">
          <div v-if="message.type === 'text'" :class="['message-bubble', `message-${message.from}`]">
            <p class="message-text">{{ message.text }}</p>
          </div>
          <IdeaCard v-else-if="message.type === 'idea'" :title="message.title" :description="message.description" @expand-idea="handleExpandIdea" />
        </template>
        <div v-if="isGenerating" class="generating-indicator">
          <div class="spinner"></div>
        </div>
      </div>
    </div>

    <div class="prompt-container">
      <div class="prompt-form">
        
        <div class="textarea-wrapper">
          <textarea
            v-model="ideaPrompt"
            class="prompt-textarea"
            placeholder="Describe your idea... e.g., 'A mobile app that helps users find local hiking trails.'"
          ></textarea>
          <div class="form-actions">
          <div class="model-selector">
            <button @click="toggleDropdown" class="dropdown-btn">
              <span>{{ selectedModel.name }}</span>
              <i class="mdi mdi-chevron-down"></i>
            </button>
            <transition name="fade">
              <div v-if="isDropdownOpen" class="dropdown-menu">
                <a v-for="model in models" :key="model.name" @click="selectModel(model)" class="dropdown-item">
                  <span class="model-name-wrapper">
                    {{ model.name }}
                    <i v-if="model.isPremium" class="mdi mdi-crown crown-icon"></i>
                  </span>
                </a>
              </div>
            </transition>
          </div>

          <button @click="openSettingsModal" class="settings-btn">
            <i class="mdi mdi-tune-variant"></i>
          </button>
          <div class="credit-display">
            <i class="mdi mdi-circle-multiple-outline"></i>
            <span>{{ userCredits }}</span>
          </div>
        </div>
          <button @click="generateIdea" class="generate-btn" :disabled="isGenerating || !ideaPrompt.trim()">
            <i class="mdi mdi-send"></i>
          </button>
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
              <div class="segmented-control" :class="`credit-${creditUsage.toLowerCase()}`">
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
              <div class="segmented-control" :class="`creativity-${creativityLevel.toLowerCase()}`">
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
            <h2 class="modal-title">
              <i class="mdi mdi-crown"></i>
              Upgrade to Premium
            </h2>
            <button @click="closePremiumModal" class="close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="premium-text">Unlock advanced AI models, higher limits, and priority access to new features.</p>
          </div>
          <div class="modal-footer">
            <button @click="closePremiumModal" class="upgrade-btn">Unlock All Features</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import IdeaCard from '../components/IdeaCard.vue';
import { supabase } from '../lib/supabaseClient';
import { userSession } from '../store/session';

const ideaPrompt = ref('');
const chatHistory = ref([]);
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
const router = useRouter();
const userCredits = ref(0); // Default value, will be fetched from DB

// Settings state
const creditOptions = ['Low', 'Medium', 'High'];
const creativityOptions = ['Low', 'Regular', 'High'];
const creditUsage = ref('Medium');
const creativityLevel = ref('Regular');

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

const fetchUserCredits = async () => {
  if (userSession.value?.user) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('regular_credits')
        .eq('id', userSession.value.user.id)
        .single();

      if (error) throw error;

      if (data) {
        userCredits.value = data.regular_credits;
      }
    } catch (err) {
      console.error('Error fetching user credits:', err.message);
      userCredits.value = 'N/A';
    }
  }
};

watchEffect(() => {
  fetchUserCredits();
});

const generateIdea = async () => {
  if (!ideaPrompt.value.trim()) return;

  const userMessage = ideaPrompt.value;
  chatHistory.value.push({ type: 'text', from: 'user', text: userMessage });
  ideaPrompt.value = ''; // Clear input after sending
  isGenerating.value = true;

  try {
    const apiUrl = "/api/langflow/lf/9363e1f2-6063-4866-88a4-fd87f601a4c4/api/v1/run/74f55130-bb9c-47b5-b3d7-af3ca14158cc";
    const apiToken = import.meta.env.VITE_ASTRA_DB_APPLICATION_TOKEN;

    if (!apiToken) {
      throw new Error("VITE_ASTRA_DB_APPLICATION_TOKEN is not set in your .env file.");
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        input_value: userMessage,
        output_type: "chat",
        input_type: "chat",
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();
    const aiText = result?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text;

    if (!aiText) {
      console.error('Unexpected API response structure:', result);
      throw new Error('Could not find AI response in the API result.');
    }

    const ideaRegex = /\[TITLE_(.*?)\]\s*\[DESC_(.*?)\]/g;
    const matches = [...aiText.matchAll(ideaRegex)];

    if (matches.length > 0) {
      for (const match of matches) {
        const title = match[1].trim();
        const description = match[2].trim();
        chatHistory.value.push({ type: 'idea', from: 'ai', title, description });
      }
    } else {
      // Fallback for plain text responses
      chatHistory.value.push({ type: 'text', from: 'ai', text: aiText });
    }

  } catch (err) {
    console.error('Error generating idea:', err.message);
    chatHistory.value.push({ type: 'text', from: 'ai', text: `Sorry, something went wrong. Please check the console for details. Make sure you have added your API token to the .env file and restarted the server.` });
  } finally {
    isGenerating.value = false;
  }
};

const handleExpandIdea = async (idea) => {
  if (!userSession.value?.user) return;

  const tempMessage = { type: 'text', from: 'system', text: `Creating idea "${idea.title}"...` };
  chatHistory.value.push(tempMessage);

  try {
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: userSession.value.user.id,
        title: idea.title,
        description: idea.description,
      })
      .select('id')
      .single();

    if (error) throw error;

    if (data && data.id) {
      tempMessage.text = `Idea created! Navigating...`;
      router.push({ name: 'IdeaDetail', params: { id: data.id } });
    } else {
      throw new Error('Failed to get new idea ID.');
    }
  } catch (err) {
    console.error('Error creating idea:', err.message);
    tempMessage.text = `Error creating idea: ${err.message}`;
  }
};
</script>

<style scoped>
.create-idea-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* Assuming 60px navbar, adjust if needed */
  min-height: 100vh;
  padding: 2rem 2rem 15rem; /* Added bottom padding for fixed prompt */
  background: #0D1117;
  background: radial-gradient(ellipse at bottom, #121820 0%, #040508 100%);
  color: #ffffff;
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.result-display-area, .placeholder-area {
  flex-grow: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.placeholder-content {
  max-width: 600px;
}

.placeholder-icon {
  font-size: 4rem;
  color: #6750A4;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.placeholder-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: -webkit-linear-gradient(45deg, #E0C3FC, #8EC5FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.placeholder-subtitle {
  font-size: 1.1rem;
  color: #b3b3cc;
  max-width: 450px;
  margin: 0 auto;
}

.generating-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner { /* Add a nice spinner animation */
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-left-color: #6750A4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.prompt-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
}

.prompt-form {
  max-width: 800px;
  margin: 0 auto;
  background-color: #1e1e1e;
  border-radius: 16px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
}

.textarea-wrapper {
  position: relative;
}

.prompt-textarea {
  width: 100%;
  min-height: 50px;
  padding: 0.5rem; /* Make space for larger button */
  font-size: 1rem;
  border: none;
  background-color: transparent;
  color: #e0e0e0;
  resize: none;
  outline: none;
  line-height: 1.5;
}

.generate-btn {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 0.75rem 0.75rem;
  border-radius: 16px;
  border: none;
  background-color: #6750A4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn .mdi {
  font-size: 1rem; /* Larger icon */
}

.generate-btn:hover:not(:disabled) {
  background-color: #7D5260;
  transform: scale(1.1);
}

.generate-btn:disabled {
  background-color: #4a4a4a;
  cursor: not-allowed;
}


.model-selector {
  position: relative;
}

.dropdown-btn, .settings-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.75rem;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid transparent;
  color: #b3b3cc;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-btn:hover, .settings-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.credit-display {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background-color: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #b3b3cc;
  border-radius: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.credit-display .mdi {
  color: #FFD700;
  font-size: 0.9rem;
}

.dropdown-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 0.5rem;
  background-color: #2c2c2c;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  padding: 0.75rem 1rem;
  overflow: hidden;
  z-index: 10;
  width: 200px;
}


.dropdown-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 0.75rem;
  border-radius: 16px;
  color: #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.model-name-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.dropdown-item:hover {
  background-color: #6750A4;
}

.crown-icon {
  color: #FFD700;
}

.result-container {
  width: 100%;
  max-width: 800px;
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #E0C3FC;
}

.result-content p {
  font-size: 1rem;
  line-height: 1.6;
  color: #b3b3cc;
  white-space: pre-wrap; /* Preserve formatting */
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: #1e1e1e;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e0e0e0;
}

.close-btn {
  background: none;
  border: none;
  color: #b3b3cc;
  cursor: pointer;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #ffffff;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  color: #b3b3cc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.segmented-control {
  display: flex;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 4px;
  transition: background-color 0.4s ease;
}

.segmented-control button {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  background-color: transparent;
  color: #b3b3cc;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.segmented-control button.active {
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Credit Usage Colors */
.credit-low button.active { background-color: #38A169; }
.credit-medium button.active { background-color: #D69E2E; }
.credit-high button.active { background-color: #805AD5; }

/* Creativity Colors */
.creativity-low button.active { background-color: #38A169; }
.creativity-regular button.active { background-color: #D69E2E; }
.creativity-high button.active { background-color: #805AD5; }

.modal-footer {
  margin-top: 2.5rem;
  display: flex;
}

.save-btn {
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background-color: #6750A4;
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn:hover {
  background-color: #56428A; /* Darker purple on hover */
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Premium Modal Specifics */
.premium-modal .modal-body {
  text-align: center;
}
.premium-modal .modal-title {
  color: #FFD700;
}
.premium-icon {
  font-size: 4rem;
  color: #805AD5;
  margin-bottom: 1.5rem;
}
.premium-text {
  color: #c0c0e0;
  line-height: 1.7;
  font-size: 1.1rem;
  margin: 0;
}
.upgrade-btn {
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: linear-gradient(45deg, #805AD5, #D69E2E);
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(128, 90, 213, 0.4);
}
.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(128, 90, 213, 0.5);
}

.chat-display-area {
  margin-top: 5rem;
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
}

.chat-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem; /* space for the last message */
}

.message-bubble {
  padding: 0.8rem 1.2rem;
  border-radius: 18px;
  max-width: 90%;
  word-wrap: break-word;
  line-height: 1.5;
}

.message-user {
  background-color: #6750A4;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 4px;
}

.message-ai {
  background-color: #2c2c2e;
  color: #e0e0e0;
  align-self: flex-start;
  border-bottom-left-radius: 4px;
}

.message-system {
  background-color: #483d3f;
  color: #ffcdd2;
  align-self: center;
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
}

.message-text {
  margin: 0;
  white-space: pre-wrap;
  font-size: 1.1rem;
}

.placeholder-subtitle {
  color: #b3b3cc;
  margin-top: 0.5rem;
  font-size: 1.1rem;
  max-width: 400px;
  text-align: center;
}

.prompt-container {
  margin-top: auto;
}

.generating-indicator {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.generating-indicator .spinner {
  width: 20px;
  height: 20px;
}
</style>
