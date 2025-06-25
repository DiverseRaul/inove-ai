<template>
  <div class="profile-page">
    <div v-if="user" class="profile-container">
      <h1 class="profile-title">My Profile</h1>
      
      <!-- Editable Profile Card -->
      <div class="profile-card">
        <div class="profile-avatar">
          <i class="mdi mdi-account-circle-outline"></i>
        </div>
        <div v-if="!editing" class="profile-info">
          <h2>{{ username || 'Set Your Username' }}</h2>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Joined:</strong> {{ new Date(user.created_at).toLocaleDateString() }}</p>
          <div class="profile-actions">
            <button @click="toggleEdit(true)" class="edit-button">
              <i class="mdi mdi-pencil-outline"></i> Edit Profile
            </button>
            <button @click="handleLogout" class="logout-button">
              <i class="mdi mdi-logout"></i>
              Log Out
            </button>
          </div>
        </div>
        <form v-else @submit.prevent="handleUpdateProfile" class="profile-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input id="username" type="text" v-model="username" placeholder="Enter your username">
          </div>
          <div class="form-actions">
            <button type="submit" class="save-button">Save</button>
            <button type="button" @click="toggleEdit(false)" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Premium Section -->
      <div class="premium-card">
        <div class="premium-icon">
          <i class="mdi mdi-star-circle-outline"></i>
        </div>
        <h2 class="premium-title">Go Premium</h2>
        <p class="premium-description">Unlock advanced features, unlimited projects, and priority support.</p>
        <button class="upgrade-button">Upgrade Now</button>
      </div>


    </div>
    <div v-else class="loading-state">
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'vue-router';

const user = ref(null);
const editing = ref(false);
const username = ref('');
const router = useRouter();

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    user.value = session.user;
    username.value = session.user.user_metadata.username || '';
  } else {
    router.push('/login');
  }
});

const toggleEdit = (isEditing) => {
  editing.value = isEditing;
  // Reset username to original value if canceling
  if (!isEditing) {
    username.value = user.value.user_metadata.username || '';
  }
};

const handleUpdateProfile = async () => {
  if (!user.value) return;
  const { data, error } = await supabase.auth.updateUser({
    data: { username: username.value }
  });

  if (error) {
    console.error('Error updating profile:', error.message);
  } else {
    user.value = data.user; // Refresh user data
    editing.value = false;
  }
};

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error.message);
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
/* General Styles */
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #020207;
  color: #e0e0e0;
  padding: 4rem 2rem;
}

.profile-container {
  width: 100%;
  max-width: 550px;
  text-align: center;
  margin-top: 2rem;
}

.profile-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  background: -webkit-linear-gradient(45deg, #E0C3FC, #8EC5FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Base Card Style */
.profile-card, .premium-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  margin-bottom: 2rem;
}

/* Profile Card */
.profile-avatar {
  font-size: 6rem;
  color: #8EC5FC;
  margin-bottom: 1rem;
}

.profile-info h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
}

.profile-info p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #b3b3cc;
}

.profile-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.edit-button,
.logout-button {
  padding: 0.7rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid;
}

.edit-button {
  background: none;
  border-color: rgba(255, 255, 255, 0.2);
  color: #b3b3cc;
}

.edit-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #8EC5FC;
  color: #fff;
}

/* Edit Form */
.profile-form .form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.profile-form label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #b3b3cc;
  margin-bottom: 0.5rem;
}

.profile-form input {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0,0,0,0.2);
  color: #fff;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.save-button, .cancel-button {
  padding: 0.7rem 1.5rem;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button {
  background-color: #8EC5FC;
  color: #020207;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #b3b3cc;
}

/* Premium Card */
.premium-card {
  border-color: #f0c419;
  text-align: center;
}

.premium-icon {
  font-size: 4rem;
  color: #f0c419;
  margin-bottom: 1rem;
}

.premium-title {
  font-size: 2rem;
  color: #f0c419;
  font-weight: 700;
}

.premium-description {
  font-size: 1.1rem;
  color: #b3b3cc;
  margin: 1rem 0 1.5rem;
}

.upgrade-button {
  padding: 0.8rem 2rem;
  border-radius: 50px;
  border: none;
  background: linear-gradient(45deg, #f0c419, #ff9a00);
  color: #020207;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upgrade-button:hover {
  box-shadow: 0 8px 25px rgba(240, 196, 25, 0.4);
  transform: translateY(-3px);
}

.logout-button {
  background-color: transparent;
  border-color: #B00020;
  color: #B00020;
}

.logout-button:hover {
  background-color: #B00020;
  color: white;
}

.loading-state {
  font-size: 1.2rem;
  color: #b3b3cc;
}
</style>
