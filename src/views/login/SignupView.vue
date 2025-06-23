<template>
  <div class="signup-container">
    <div class="floating-shapes-bg">
      <span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="signup-card">
      <div class="signup-header">
        <h1 class="title-large">Create Account</h1>
        <p class="body-medium text-on-surface-variant">Join <b>inove</b> today</p>
      </div>
      
      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-group form-grid">
          <div>
            <label for="firstName" class="form-label">First Name</label>
            <div class="input-container" :class="{ 'input-focused': isFocusedFirstName }">
              <input 
                type="text" 
                id="firstName" 
                v-model="firstName" 
                @focus="isFocusedFirstName = true" 
                @blur="isFocusedFirstName = false" 
                required
                class="form-input" 
                placeholder="E.g., John"
              />
              <div class="input-highlight"></div>
            </div>
          </div>
          
          <div>
            <label for="lastName" class="form-label">Last Name</label>
            <div class="input-container" :class="{ 'input-focused': isFocusedLastName }">
              <input 
                type="text" 
                id="lastName" 
                v-model="lastName" 
                @focus="isFocusedLastName = true" 
                @blur="isFocusedLastName = false" 
                required
                class="form-input" 
                placeholder="E.g., Doe"
              />
              <div class="input-highlight"></div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <div class="input-container" :class="{ 'input-focused': isFocusedUsername }">
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              @focus="isFocusedUsername = true" 
              @blur="isFocusedUsername = false" 
              required
              class="form-input" 
              placeholder="Choose a unique username"
            />
            <div class="input-highlight"></div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div class="input-container" :class="{ 'input-focused': isFocusedEmail }">
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              @focus="isFocusedEmail = true" 
              @blur="isFocusedEmail = false" 
              required
              class="form-input" 
              placeholder="your.email@example.com"
            />
            <div class="input-highlight"></div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Password:</label>
          <div class="input-container" :class="{ 'input-focused': isFocusedPassword }">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              @focus="isFocusedPassword = true" 
              @blur="isFocusedPassword = false" 
              required
              class="form-input" 
              placeholder="Create a strong password"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              title="Toggle password visibility"
            >
              <svg v-if="showPassword" class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <svg v-else class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C21.27 9.61 17 6.5 12 6.5c-1.45 0-2.83.32-4.1.89l1.57 1.57C10.74 7.13 11.35 7 12 7zm-1.07 1.07L13 10.14C12.67 10.06 12.34 10 12 10c-1.66 0-3 1.34-3 3 0 .34.06.67.14 1l-2.07 2.07C6.39 15.17 6 14.11 6 13c0-2.76 2.24-5 5-5 .89 0 1.7.24 2.4.64L10.93 8.07zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/>
              </svg>
            </button>
            <div class="input-highlight"></div>
          </div>
          <div class="password-strength" :class="passwordStrengthClass">
            <div class="strength-bar"></div>
            <div class="strength-bar"></div>
            <div class="strength-bar"></div>
            <div class="strength-bar"></div>
          </div>
          <p class="password-hint" v-if="password">{{ passwordHint }}</p>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <div class="input-container" :class="{ 
            'input-focused': isFocusedConfirmPassword,
            'input-error': password && confirmPassword && password !== confirmPassword
          }">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              @focus="isFocusedConfirmPassword = true" 
              @blur="isFocusedConfirmPassword = false" 
              required
              class="form-input" 
              placeholder="Re-enter your password"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
              title="Toggle password visibility"
            >
               <svg v-if="showConfirmPassword" class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <svg v-else class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75C21.27 9.61 17 6.5 12 6.5c-1.45 0-2.83.32-4.1.89l1.57 1.57C10.74 7.13 11.35 7 12 7zm-1.07 1.07L13 10.14C12.67 10.06 12.34 10 12 10c-1.66 0-3 1.34-3 3 0 .34.06.67.14 1l-2.07 2.07C6.39 15.17 6 14.11 6 13c0-2.76 2.24-5 5-5 .89 0 1.7.24 2.4.64L10.93 8.07zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/>
              </svg>
            </button>
            <div class="input-highlight"></div>
          </div>
          <p class="error-message" v-if="password && confirmPassword && password !== confirmPassword">
            Passwords don't match
          </p>
        </div>
        
        <div class="form-group">
          <div class="terms-container">
            <label class="checkbox-container">
              <input type="checkbox" v-model="agreeTerms" required />
              <span class="checkmark"></span>
              <span class="checkbox-label">I agree to the <a href="#" target="_blank" rel="noopener noreferrer" class="terms-link">Terms of Service</a> and <a href="#" target="_blank" rel="noopener noreferrer" class="terms-link">Privacy Policy</a></span>
            </label>
          </div>
        </div>

        <p v-if="signupError" class="error-message" style="margin-bottom: 1rem; text-align: center;">{{ signupError }}</p>
        
        <button 
          type="submit" 
          class="signup-button"
          :class="{ 'button-loading': isLoading }"
          :disabled="!!(isLoading || !agreeTerms || (password && confirmPassword && password !== confirmPassword))"
        >
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="loader"></span>
        </button>
      </form>
      
      <div class="login-prompt">
        <p>
          Already have an account? 
          <RouterLink to="/login" class="login-link">Sign In</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router'; 
import { supabase } from "../../supabase.js";

// Form state
const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const signupError = ref<string | null>(null); 

const router = useRouter(); 

// Focus states for input animations
const isFocusedFirstName = ref(false);
const isFocusedLastName = ref(false);
const isFocusedUsername = ref(false);
const isFocusedEmail = ref(false);
const isFocusedPassword = ref(false);
const isFocusedConfirmPassword = ref(false);

// Password strength calculation
const passwordStrength = computed(() => {
  if (!password.value) return 0;
  let strength = 0;
  const val = password.value;
  if (val.length >= 8) strength++;
  if (val.length >= 12) strength++; 
  if (/[A-Z]/.test(val)) strength++;
  if (/[a-z]/.test(val)) strength++; 
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++; 
  return Math.min(strength, 4); 
});

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0 && password.value.length > 0) return 'strength-0'; 
  if (strength === 0 && password.value.length === 0) return ''; 
  return `strength-${strength}`;
});

const passwordHint = computed(() => {
  if (!password.value) return '';
  const strength = passwordStrength.value;
  if (strength <= 1) return 'Weak - Add length, numbers, or symbols.';
  if (strength === 2) return 'Fair - Consider adding more variety.';
  if (strength === 3) return 'Good - Strong password.';
  return 'Excellent - Very strong password!';
});

// Form handler
const handleSignup = async () => {
  signupError.value = null;

  if (password.value !== confirmPassword.value) {
    signupError.value = "Passwords do not match.";
    return;
  }
  if (!agreeTerms.value) {
    signupError.value = "You must agree to the terms and conditions.";
    return;
  }

  isLoading.value = true;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: username.value,
          full_name: `${firstName.value.trim()} ${lastName.value.trim()}`
        }
        },
        emailRedirectTo: `${window.location.origin}/auth/confirmed` // Ensure this path matches your Vue router and Supabase redirect settings
      }
    });

    if (error) {
      signupError.value = error.message;
    } else if (data.user) {
      console.log('Supabase signUp successful:', data);
      
      // Check if email confirmation is pending (user object exists, but no session)
      // Reset form fields first
      firstName.value = '';
      lastName.value = '';
      email.value = '';
      password.value = '';
      confirmPassword.value = '';
      agreeTerms.value = false;

      if (data.user && !data.session) {
        // Email confirmation is likely required
        router.push('/check-email');
      } else {
        // User is signed up and session likely exists (e.g., email confirmation disabled or auto-confirmed)
        // Redirect to login, could later add a query param for success message
        router.push('/login'); 
      }
    } else {
      signupError.value = 'An unexpected issue occurred. No user data returned from Supabase.';
    }
  } catch (err: any) {
    console.error('Unexpected error during signup:', err);
    signupError.value = err.message || 'An unknown error occurred during signup.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>

.signup-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.5rem;
  background: var(--color-background);
  background-size: 400% 400%;
  animation: subtleGradientBG 25s ease infinite;
  overflow: hidden; /* Hide scrollbars if gradient makes page too large */
}

.signup-card {
  width: 100%;
  max-width: 550px; /* Slightly wider for more fields */
  padding: 2.5rem;
  border-radius: var(--radius-xl, 20px);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-3, 0 4px 15px rgba(0,0,0,0.1));
  animation: fadeIn 0.5s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 1;
}

.signup-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-4, 0 8px 25px rgba(0,0,0,0.15));
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.signup-header {
  margin-bottom: 2rem;
  text-align: center;
}

.signup-header h1 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-weight: 700;
  font-size: 2.5rem; /* Consistent with login */
}

 

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem; /* Add margin if it's a direct child of form */
}

.form-group {
  margin-bottom: 1.25rem; /* Slightly reduced margin for denser form */
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-on-surface-variant);
  font-weight: 500;
  font-size: 0.875rem;
}

.input-container {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-l, 12px);
  border: 1px solid var(--color-outline);
  background-color: var(--color-surface-container, var(--color-surface)); /* Ensure background for inputs */
  transition: all 0.3s ease;
  display: flex; /* For toggle button alignment */
  align-items: center;
}

.input-container:hover {
  border-color: var(--color-outline-variant, var(--color-primary-light));
}

.title-large {
  color: var(--color-primary);
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem; /* Consistent padding */
  border: none;
  background-color: transparent;
  color: var(--color-on-surface);
  font-size: 1rem;
  outline: none;
  flex-grow: 1; /* Allow input to take space */
}

.form-input::placeholder {
  color: var(--color-on-surface-variant);
  opacity: 0.7;
}

.input-focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(103, 58, 183, 0.25), 0 0 8px rgba(103, 58, 183, 0.15);
}

.input-error {
  border-color: var(--color-error) !important;
  box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.25) !important; /* Error color from Material spec */
}

.input-highlight {
  position: absolute;
  bottom: 0;
  left: 50%; 
  width: 0%;  
  height: 2px;
  background-color: var(--color-primary);
  transition: width 0.35s ease-out, left 0.35s ease-out;
}
            
.input-focused .input-highlight {
  width: 100%; 
  left: 0;     
}

.input-error .input-highlight {
  background-color: var(--color-error);
}

.toggle-password {
  background: none;
  border: none;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  padding: 0.75rem; /* Make clickable area larger */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: var(--color-primary);
}

.eye-icon {
  width: 20px;
  height: 20px;
}

.password-strength {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
  height: 6px; /* Slightly thicker bars */
}

.strength-bar {
  flex: 1;
  background-color: var(--color-surface-container-high, #e0e0e0);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.password-strength.strength-0 .strength-bar:nth-child(1) { background-color: var(--color-error, #d32f2f); }
.password-strength.strength-1 .strength-bar:nth-child(1) { background-color: var(--color-error, #d32f2f); }
.password-strength.strength-2 .strength-bar:nth-child(-n+2) { background-color: var(--color-warning, #ffa000); }
.password-strength.strength-3 .strength-bar:nth-child(-n+3) { background-color: var(--color-info, #1976d2); } /* Using info as a step */
.password-strength.strength-4 .strength-bar { background-color: var(--color-success, #388e3c); }


.password-hint {
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-on-surface-variant);
  min-height: 1.2em; /* Reserve space to prevent layout shifts */
}

.error-message {
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-error);
  min-height: 1.2em;
}

.terms-container {
  display: flex;
  align-items: flex-start; /* Align checkbox with start of text */
}

.checkbox-container {
  display: inline-flex; /* Changed to inline-flex */
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 28px; /* Space for custom checkbox */
  user-select: none;
  font-size: 0.875rem;
  color: var(--color-on-surface-variant);
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background-color: var(--color-surface-container-high, #eee);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-s, 4px);
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: var(--color-surface-container-highest, #ddd);
  border-color: var(--color-primary);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  line-height: 1.4;
}

.terms-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
  color: var(--color-primary-dark, var(--color-primary));
}

.signup-button {
  width: 100%;
  padding: 0.875rem 1rem; /* Consistent with login button */
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--radius-l, 12px);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem; /* Add some space above button */
}

.signup-button::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease-out;
}

.signup-button:hover:not(:disabled)::before {
  left: 100%;
}

.signup-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark, #5d3fd3);
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-4, 0 8px 20px rgba(0,0,0,0.15));
}

.signup-button:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
  box-shadow: var(--shadow-2, 0 4px 10px rgba(0,0,0,0.1));
}

.signup-button:disabled {
  background-color: var(--color-surface-disabled, #bdbdbd); /* Material disabled color */
  color: var(--color-on-surface-disabled, #757575);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-loading .loader {
  width: 20px;
  height: 20px;
  border: 3px solid var(--color-on-primary-container, rgba(255,255,255,0.3));
  border-top-color: var(--color-on-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-prompt {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--color-on-surface-variant);
  font-size: 0.9rem;
}

.login-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.login-link:hover {
  color: var(--color-primary-dark, #5d3fd3);
  text-decoration: underline;
}

/* Floating Shapes Background (same as login) */
.floating-shapes-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0; 
}

.floating-shapes-bg span {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(103, 58, 183, 0.15); /* Primary-like color with alpha */
  animation: float 25s linear infinite;
  bottom: -180px; /* Start off-screen */
  border-radius: 50%;
}

.floating-shapes-bg span:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
.floating-shapes-bg span:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
.floating-shapes-bg span:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
.floating-shapes-bg span:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; border-radius: 10%; background: rgba(103, 58, 183, 0.1); }
.floating-shapes-bg span:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
.floating-shapes-bg span:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; border-radius: 15%; background: rgba(0, 150, 136, 0.1); } /* Secondary-like */
.floating-shapes-bg span:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; background: rgba(255, 193, 7, 0.08); } /* Tertiary-like */
.floating-shapes-bg span:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
.floating-shapes-bg span:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; border-radius: 20%; background: rgba(0, 150, 136, 0.12); }
.floating-shapes-bg span:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; background: rgba(103, 58, 183, 0.07); }

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(-120vh) rotate(720deg);
    opacity: 0;
  }
}

/* Responsive styles */
@media (max-width: 768px) { /* Adjust breakpoint for form grid */
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem; /* Adjust gap for single column */
    margin-bottom: 0; /* Remove bottom margin if fields stack directly */
  }
  .form-grid > div {
    margin-bottom: 1.25rem; /* Add margin to stacked items */
  }
  .form-grid > div:last-child {
    margin-bottom: 0; /* Remove margin from last stacked item if followed by another group */
  }
  .signup-card {
    padding: 2rem; /* Adjust padding for smaller screens */
  }
}

@media (max-width: 576px) {
  .signup-card {
    padding: 1.5rem;
    max-width: 100%; /* Allow full width on very small screens */
  }
  .signup-header h1 {
    font-size: 1.75rem;
    color: var(--color-primary);
  }
}

/* Keyframes for background animation */
@keyframes subtleGradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Dark mode specific styles */
@media (prefers-color-scheme: dark) {

  .input-container {
    background-color: var(--color-surface-container-high, #2a2a2e); /* Darker input background */
  }

  .checkmark {
    background-color: var(--color-surface-container-highest, #35353a);
    border-color: var(--color-outline-variant);
  }

  .checkbox-container:hover input ~ .checkmark {
    background-color: var(--color-surface-dim, #3f3f46);
  }


  .signup-button:disabled {
    background-color: var(--color-surface-variant, #49454F); /* Material dark disabled */
    color: var(--color-on-surface-variant, #CAC4D0);
    opacity: 0.38; /* Standard opacity for disabled components in dark mode */
  }
}

<style>
.login-button::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease-out;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover {
  background-color: var(--color-primary-dark, #5d3fd3);
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-4, 0 8px 20px rgba(0,0,0,0.15));
}

.login-button:active {
  transform: translateY(-1px) scale(0.98);
  box-shadow: var(--shadow-2, 0 4px 10px rgba(0,0,0,0.1));
}

.button-loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: var(--color-on-surface-variant);
  font-size: 0.875rem;
}

.login-divider::before,
.login-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: var(--color-outline-variant);
}

.login-divider span {
  padding: 0 1rem;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px; /* Slightly larger */
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--color-outline-variant);
  background-color: var(--color-surface-container-high, #f0f0f0);
  transition: all 0.2s ease-out;
  cursor: pointer;
  color: var(--color-on-surface-variant);
}

.social-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: var(--shadow-3, 0 6px 15px rgba(0,0,0,0.12));
  border-color: var(--color-primary);
  background-color: var(--color-surface-container-highest, #e8e8e8);
  color: var(--color-primary);
}

.social-button:active {
  transform: translateY(-2px) scale(0.95);
  box-shadow: var(--shadow-1, 0 2px 5px rgba(0,0,0,0.1));
}

.social-icon {
  width: 24px;
  height: 24px;
}

.signup-prompt {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--color-on-surface-variant);
  font-size: 0.9rem;
}

.signup-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.signup-link:hover {
  color: var(--color-primary-dark, #5d3fd3);
  text-decoration: underline;
}

/* Floating Shapes Background */
.floating-shapes-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0; 
}

.floating-shapes-bg span {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: rgba(103, 58, 183, 0.15); /* Primary-like color with alpha */
  animation: float 25s linear infinite;
  bottom: -180px; /* Start off-screen */
  border-radius: 50%;
}

.floating-shapes-bg span:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
.floating-shapes-bg span:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
.floating-shapes-bg span:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
.floating-shapes-bg span:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; border-radius: 10%; background: rgba(103, 58, 183, 0.1); }
.floating-shapes-bg span:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
.floating-shapes-bg span:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; border-radius: 15%; background: rgba(0, 150, 136, 0.1); } /* Secondary-like */
.floating-shapes-bg span:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; background: rgba(255, 193, 7, 0.08); } /* Tertiary-like */
.floating-shapes-bg span:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
.floating-shapes-bg span:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; border-radius: 20%; background: rgba(0, 150, 136, 0.12); }
.floating-shapes-bg span:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; background: rgba(103, 58, 183, 0.07); }

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(-120vh) rotate(720deg); /* Ensure they go well off screen */
    opacity: 0;
  }
}

.forgot-password-prompt {
  margin-top: 0.75rem; 
  text-align: center; 
}

.forgot-password-link-new {
  color: var(--color-on-surface-variant);
  font-size: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.forgot-password-link-new:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.eye-icon {
  /* currentColor will be inherited from the button's color property */
  /* Size is set directly on SVG element */
}

/* Responsive styles */
@media (max-width: 576px) {
  .login-card {
    padding: 1.5rem;
  }
}

/* Keyframes for background animation */
@keyframes subtleGradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Dark mode specific styles for gradient */
@media (prefers-color-scheme: dark) {
  .social-button {
    background-color: var(--color-surface-container-high, #2a2a2e);
    color: var(--color-on-surface-variant);
  }

  .social-button:hover {
    background-color: var(--color-surface-container-highest, #35353a);
    color: var(--color-primary);
  }
}
</style>
