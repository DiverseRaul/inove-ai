import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '@/types/supabase'

// Create Supabase client
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey)

// Database service functions
export class DatabaseService {
  // Contact form submission
  static async submitContactForm(formData: any) {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            phone: formData.phone || null,
            project_type: formData.projectType,
            budget: formData.budget || null,
            timeline: formData.timeline || null,
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error submitting contact form:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Newsletter subscription
  static async subscribeToNewsletter(email: string) {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email,
            subscribed_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Error subscribing to newsletter:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get featured projects
  static async getFeaturedProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching featured projects:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Get all projects with optional category filter
  static async getProjects(category?: string) {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching projects:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  // Analytics - track page views
  static async trackPageView(page: string) {
    try {
      const { data, error } = await supabase
        .from('page_views')
        .insert([
          {
            page,
            viewed_at: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        ])

      if (error) {
        console.error('Error tracking page view:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Unexpected error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }
}

