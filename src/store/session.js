import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

// This will hold the user's session information, reactive to changes.
export const userSession = ref(null)

/**
 * A helper function to manage the user's session by listening to Supabase auth events.
 * This should be called once when your application starts.
 */
export const useAuth = () => {
  // Set the initial user session
  supabase.auth.getSession().then(({ data: { session } }) => {
    userSession.value = session
  })

  // Listen for changes in authentication state (login, logout, etc.)
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase auth event:', event)
    userSession.value = session
  })

  return {
    userSession,
  }
}
