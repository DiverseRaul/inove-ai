// Supabase configuration
export interface SupabaseConfig {
  url: string
  anonKey: string
}

// Default configuration (replace with your actual Supabase credentials)
export const supabaseConfig: SupabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
}

// Contact form data interface
export interface ContactFormData {
  id?: string
  name: string
  email: string
  company?: string
  phone?: string
  project_type: string
  budget?: string
  timeline?: string
  message: string
  created_at?: string
}

// Newsletter subscription interface
export interface NewsletterSubscription {
  id?: string
  email: string
  subscribed_at?: string
}

// Project showcase interface
export interface Project {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  image_url?: string
  project_url?: string
  featured: boolean
  created_at?: string
}

