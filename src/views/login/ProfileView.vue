<template>
  <div class="profile-view-wrapper">
    <NavBar />
    <main class="profile-main-content">
      <div class="profile-card">
        <h1 class="profile-title">Edit Profile</h1>

        <div v-if="isLoading" class="status-message loading-message">
          <div class="loader"></div>
          <p>Loading your profile...</p>
        </div>
        <div v-else-if="error && !profile" class="status-message error-container">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="profile" class="profile-form-container">
          <form @submit.prevent="handleProfileUpdate" class="profile-form">
            <!-- Profile Edit Form Fields -->
            <div class="avatar-section">
              <img 
                :src="editableProfile.avatar_url || defaultAvatar" 
                alt="User Avatar" 
                class="profile-avatar-preview"
                @error="onAvatarError"
              />
              <div class="form-group avatar-url-group">
                <label for="avatarUrl" class="form-label"><span class="material-icons-outlined form-label-icon">image</span>Avatar URL</label>
                <div class="input-with-button">
                  <input 
                    type="url" 
                    id="avatarUrl" 
                    v-model="editableProfile.avatar_url" 
                    placeholder="https://example.com/avatar.png"
                    class="form-input"
                  />
                  <button type="button" @click="triggerAvatarFileInput" class="upload-avatar-button">
                    <span class="material-icons-outlined">upload_file</span>
                  </button>
                </div>
                <input type="file" ref="avatarFileInputRef" @change="handleAvatarFileSelected" style="display: none;" accept="image/*" />
              </div>
            </div>

            <div class="profile-fields-group">
              <div class="form-row">
              <div class="form-group">
                <label for="username" class="form-label"><span class="material-icons-outlined form-label-icon">account_circle</span>Username</label>
                <input type="text" id="username" v-model="editableProfile.username" placeholder="your_cool_username" class="form-input"/>
                <small class="input-hint">This will be part of your public profile URL.</small>
              </div>
              <div class="form-group">
                <label for="fullName" class="form-label"><span class="material-icons-outlined form-label-icon">badge</span>Full Name</label>
                <input type="text" id="fullName" v-model="editableProfile.full_name" placeholder="Ada Lovelace" class="form-input"/>
              </div>
            </div>

            <div class="form-group">
              <label for="bio" class="form-label"><span class="material-icons-outlined form-label-icon">article</span>Bio</label>
              <textarea id="bio" v-model="editableProfile.bio" rows="4" placeholder="Tell the world about your amazing work and passions..." class="form-input form-textarea"></textarea>
            </div>

            <div class="form-group">
              <label for="websiteUrl" class="form-label"><span class="material-icons-outlined form-label-icon">link</span>Main Website URL</label>
              <input type="url" id="websiteUrl" v-model="editableProfile.website_url" placeholder="https://your-portfolio.com" class="form-input"/>
            </div>
            </div> <!-- End .profile-fields-group -->
            
            <div class="form-actions">
              <button type="submit" class="button-primary save-button" :disabled="isSaving">
                <span v-if="isSaving" class="button-loader"></span>
                {{ isSaving ? 'Saving...' : 'Save Profile' }}
              </button>
              <p v-if="saveStatusMessage" 
                 :class="['save-status', saveError ? 'error-text' : 'success-text']"
                 aria-live="polite"
              >
                {{ saveStatusMessage }}
              </p>
            </div>
          </form>
        </div> <!-- End .profile-form-container -->
      </div> <!-- End .profile-card -->

      <!-- Your Portfolios Section Placeholder -->
      <div v-if="profile" class="portfolios-section">
        <h2 class="section-title">Your Portfolios</h2>
        <div class="placeholder-content">
          <p>This is where your portfolio items or links will be displayed.</p>
          <p>Functionality to add and manage portfolios will be implemented soon!</p>
        </div>
        <div class="create-portfolio-action">
          <button @click="navigateToCreatePortfolio" class="button-primary">
            <span class="material-icons-outlined">add_circle</span>
            Create New Portfolio
          </button>
        </div>
      </div>
      <!-- End Your Portfolios Section Placeholder -->
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../supabase.js';
import type { User, PostgrestError } from '@supabase/supabase-js';
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/Footer.vue';

const defaultAvatar = ref("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='%23CAC4CF'%3E%3Cpath%20d='M12%2012c2.21%200%204-1.79%204-4s-1.79-4-4-4-4%201.79-4%204%201.79%204%204%204zm0%202c-2.67%200-8%201.34-8%204v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E");

const onAvatarError = (event: Event) => {
  (event.target as HTMLImageElement).src = defaultAvatar.value;
};

interface Profile {
  id: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  website_url?: string | null;
  updated_at?: string | null;
}

const currentUser = ref<User | null>(null);
const profile = ref<Profile | null>(null);
const editableProfile = reactive<Partial<Profile>>({});

const isLoading = ref(true);
const error = ref<string | null>(null);
const isSaving = ref(false);
const saveStatusMessage = ref<string | null>(null);
const saveError = ref(false);
const avatarFileInputRef = ref<HTMLInputElement | null>(null);
const router = useRouter();

const fetchProfile = async (userId: string) => {
  isLoading.value = true;
  error.value = null;
  try {
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }
    if (data) {
      profile.value = data;
      Object.assign(editableProfile, data);
    } else {
      profile.value = null; 
    }
  } catch (err) {
    const e = err as PostgrestError | Error;
    console.error('Error fetching profile:', e.message);
    error.value = 'Failed to load profile data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

const initializeEmptyProfile = () => {
  if (!currentUser.value) return;
  const newProfileShell: Profile = {
    id: currentUser.value.id,
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '',
    website_url: '',
  };
  profile.value = { ...newProfileShell }; // Set profile to a non-null object to trigger form display
  Object.assign(editableProfile, newProfileShell);
  error.value = null;
  saveStatusMessage.value = null;
};

const handleProfileUpdate = async () => {
  if (!currentUser.value) {
    saveStatusMessage.value = 'Authentication error. Please log in again.';
    saveError.value = true;
    return;
  }

  isSaving.value = true;
  saveStatusMessage.value = null;
  saveError.value = false;

  const profileDataToSave: Omit<Profile, 'updated_at'> & { updated_at?: string } = {
    id: currentUser.value.id,
    username: editableProfile.username || null,
    full_name: editableProfile.full_name || null,
    bio: editableProfile.bio || null,
    avatar_url: editableProfile.avatar_url || null,
    website_url: editableProfile.website_url || null,
  };
  
  profileDataToSave.updated_at = new Date().toISOString();

  try {
    const { data, error: upsertError } = await supabase
      .from('profiles')
      .upsert(profileDataToSave, { onConflict: 'id' })
      .select()
      .single();

    if (upsertError) throw upsertError;

    if (data) {
      profile.value = data;
      Object.assign(editableProfile, data);
      saveStatusMessage.value = 'Profile updated successfully!';
      saveError.value = false;
    }
  } catch (err) {
    const e = err as PostgrestError | Error;
    console.error('Error saving profile:', e.message);
    saveStatusMessage.value = `Save failed: ${e.message.substring(0, 100)}`;
    saveError.value = true;
  } finally {
    isSaving.value = false;
    setTimeout(() => { saveStatusMessage.value = null; }, 5000);
  }
};

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    currentUser.value = session.user;
    await fetchProfile(session.user.id);
  } else {
    error.value = 'Please log in to manage your profile.';
    isLoading.value = false;
  }

  supabase.auth.onAuthStateChange((_event, newSession) => {
    if (newSession?.user && newSession.user.id !== currentUser.value?.id) {
      currentUser.value = newSession.user;
      fetchProfile(newSession.user.id);
    } else if (!newSession?.user) {
      currentUser.value = null;
      profile.value = null;
      Object.keys(editableProfile).forEach(key => delete editableProfile[key as keyof Profile]);
      error.value = 'You have been logged out. Please log in.';
      isLoading.value = false; // Ensure loading state is reset
    }
  });
});

const triggerAvatarFileInput = () => {
  avatarFileInputRef.value?.click();
};

const handleAvatarFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    // For now, let's just log it. Actual upload and URL generation will be handled later.
    console.log('Selected file:', file.name, file.type);
    // You would typically upload the file here and get back a URL
    // then set editableProfile.avatar_url = newUrl;
    // For demonstration, let's create a local blob URL (this won't persist)
    const localUrl = URL.createObjectURL(file);
    editableProfile.avatar_url = localUrl; 
    // Note: Blob URLs are temporary. For persistence, upload to Supabase Storage.
  }
};

const navigateToCreatePortfolio = () => {
  router.push('/create-portfolio');
};

watch(() => profile.value, (newProfile) => {
  if (newProfile) {
    Object.assign(editableProfile, newProfile);
  }
}, { deep: true });

</script>

<style scoped>
.profile-view-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background, #121212); /* Use global body background color */
}
  
.profile-main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column; /* Stack cards vertically */
  align-items: center; /* Center cards horizontally */
  justify-content: center; /* Adjust as needed, e.g., flex-start for top alignment */
  gap: var(--spacing-xl); /* Space between cards */
  padding: calc(var(--navbar-height, 60px) + var(--spacing-lg)) var(--spacing-md) var(--spacing-xl);
}

.profile-card {
  width: 100%;
  max-width: 800px; /* Slightly wider for more content */
  margin-top: 2%;
  padding: var(--spacing-xl); /* Consistent padding on all sides */
  background-color: var(--color-surface, #1a1825);
  border-radius: var(--radius-xl, 20px);
  box-shadow: var(--shadow-4, 0 8px 30px rgba(0,0,0,0.25));
  animation: fadeInScaleUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}

@keyframes fadeInScaleUp {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.profile-title {
  font-size: var(--font-size-headline-medium, 2.15rem); /* Restored: Slightly larger */
  color: var(--color-primary, #d0bcff); /* Restored: Primary color */
  text-align: center;
  margin-bottom: var(--spacing-xxl); /* Restored: Larger margin */
  font-weight: 700; /* Restored: Bolder */
  letter-spacing: 0.5px; /* Restored: Added letter spacing */
  text-shadow: 0 1px 3px rgba(0,0,0,0.2); /* Restored: Subtle text shadow */
  padding-bottom: var(--spacing-lg); /* Added: Space below title text */
  border-bottom: 1px solid var(--color-outline-variant, #49454F); /* Added: Separator line */
}

.status-message {
  text-align: center;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  color: var(--color-on-surface-variant, #cac4cf);
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-title-medium);
}

.error-container {
  background-color: var(--color-error-container-transparent, #5c191980);
  color: var(--color-on-error-container, #ffdad6);
  border: 1px solid var(--color-error, #f2b8b5);
}

.profile-form-container {
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-md);
}

.profile-avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  align-self: center;
  border: 2px solid var(--color-primary-container, #4f378b);
  box-shadow: var(--shadow-2);
  background-color: var(--color-surface-container-high); /* Placeholder bg */
}

.avatar-url-group {
  width: 100%;
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.input-with-button .form-input {
  flex-grow: 1; /* Input takes available space */
}

.upload-avatar-button {
  background-color: var(--color-primary-container, #4f378b);
  color: var(--color-on-primary-container, #ffffff);
  border: none;
  border-radius: var(--radius-md);
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: var(--spacing-md);
  padding-right: var(--spacing-md); /* Smaller padding for this button */
  min-width: auto; /* Allow button to be smaller */
  font-size: var(--font-size-label-medium); /* Slightly smaller font */
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 600px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
  .avatar-section {
    flex-direction: row;
    align-items: flex-end;
    gap: var(--spacing-lg);
  }
  .profile-avatar-preview {
    width: 80px;
    height: 80px;
  }
}

.form-row {
  display: flex;
  flex-direction: column; /* Stack fields vertically */
  gap: var(--spacing-lg);    /* Spacing between items in the column */
  /* No margin-bottom here, as .form-group children will have their own */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl); /* Increased bottom margin for better spacing */
}

.form-label-icon {
  font-size: var(--icon-size-medium, 20px);
  color: var(--color-primary); /* Ensure icons are purple */
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm); /* Space between icon and text */
  font-size: var(--font-size-label-large, 0.95rem);
  color: var(--color-on-surface-variant, #cac4cf);
  font-weight: 500;
}


.form-input, .form-textarea {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-surface-container-high, #2c2a3a);
  color: var(--color-on-surface, #e6e1e5);
  border: 1px solid var(--color-outline, #454257);
  border-radius: var(--radius-md, 8px);
  font-size: var(--font-size-body-large, 1rem);
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, transform 0.15s ease-in-out;
}

.form-input:hover,
.form-textarea:hover {
  border-color: var(--color-primary-transparent-70, #d0bcffb3); /* Primary color but slightly transparent for hover */
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary, #d0bcff); /* Prominent focus border */
  box-shadow: 0 0 0 2px var(--color-primary-transparent-30, #d0bcff4d); /* Focus ring */
  transform: scale(1.005); /* Very subtle scale */
  outline: none; /* Remove default browser outline */
}

.form-input::placeholder, .form-textarea::placeholder {
  color: var(--color-on-surface-variant-translucent, #cac4cf80);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--color-primary, #d0bcff);
  box-shadow: 0 0 0 2px var(--color-primary-transparent-20, #d0bcff33);
  background-color: var(--color-surface-container-highest, #383549);
}

.input-hint {
  font-size: var(--font-size-body-small, 0.75rem);
  color: var(--color-on-surface-variant, #b0aac0);
  padding-left: var(--spacing-xs);
}

.form-actions {
  margin-top: var(--spacing-2xl); /* Increased space before actions */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.button-primary, .button-secondary {
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-size: var(--font-size-label-large, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  border: none;
  min-width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.button-primary {
  background-color: var(--color-primary, #d0bcff);
  color: var(--color-on-primary, #381e72);
  box-shadow: var(--shadow-1);
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark, #b59ff5);
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.button-primary:disabled {
  background-color: var(--color-surface-variant, #49454F);
  color: var(--color-on-surface-variant, #CAC4CF);
  cursor: not-allowed;
  box-shadow: none;
}

.button-secondary {
  background-color: var(--color-secondary-container, #4a4458);
  color: var(--color-on-secondary-container, #e8def8);
}

.button-secondary:hover {
  background-color: var(--color-secondary-container-hover, #5e5870);
  transform: translateY(-2px);
}

.save-status {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-body-medium);
  font-weight: 500;
}

.success-text {
  color: var(--color-tertiary, #79d87d);
}

.error-text {
  color: var(--color-error, #f2b8b5);
}

.profile-fields-group {
  margin-top: var(--spacing-xl); /* Add space after avatar section */
}

.create-profile-prompt {
  background-color: var(--color-surface-container-high, #2c2a3a);
  border: 1px dashed var(--color-outline-variant, #6b667d);
}

.create-profile-prompt p {
  margin-bottom: var(--spacing-md);
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid var(--color-primary-transparent-40, #d0bcff66);
  border-bottom-color: var(--color-primary, #d0bcff);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.button-loader {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-on-primary-transparent, #ffffff80);
  border-bottom-color: var(--color-on-primary, #381e72);
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 0.8s linear infinite;
}

.create-portfolio-action {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Styles for Portfolios Section */
.portfolios-section {
  width: 100%;
  max-width: 800px; /* Match profile-card */
  padding: var(--spacing-xl); /* Match profile-card */
  background-color: var(--color-surface, #1a1825); /* Match current profile-card style */
  border-radius: var(--radius-xl, 20px); /* Match current profile-card style */
  box-shadow: var(--shadow-4); /* Match profile-card */
  animation: fadeInScaleUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); /* Match profile-card */
  /* Ensure it's not nested causing double animation if profile-card also has it */
}

.section-title {
  font-size: var(--font-size-headline-small, 1.75rem);
  color: var(--color-on-surface, #e6e1e5);
  margin-bottom: var(--spacing-lg);
  text-align: center;
}

.placeholder-content {
  background-color: var(--color-surface-container, #222028);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--color-on-surface-variant, #cac4cf);
  font-size: var(--font-size-body-large);
  border: 1px dashed var(--color-outline, #8f8a99);
}

.placeholder-content p {
  margin-bottom: var(--spacing-sm);
}

.placeholder-content p:last-child {
  margin-bottom: 0;
}

/* Custom spacing variable (if not already defined globally) */
:root {
  --spacing-lg_plus_sm: calc(var(--spacing-lg) + var(--spacing-sm)); /* Example: 24px + 8px = 32px */
}

</style>
