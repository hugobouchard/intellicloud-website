import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const authHelpers = {
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          hd: 'intellicloud.com' // Only allow intellicloud.com domain
        }
      }
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChanged(callback)
  },

  isIntelliCloudUser: (user) => {
    return user?.email?.endsWith('@intellicloud.com')
  },

  checkAdminAccess: async (user) => {
    if (!user || !authHelpers.isIntelliCloudUser(user)) {
      return false
    }

    try {
      const { data, error } = await supabase
        .from('ic_web_admin_users')
        .select('*')
        .eq('email', user.email)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Admin access check error:', error.message)
        return false
      }
      if (!data) return false
      return true
    } catch (err) {
      console.error('Admin access check exception:', err)
      return false
    }
  }
}

// Database helper functions
export const db = {
  // Pages
  getPublishedPages: async (language = 'en') => {
    const { data, error } = await supabase
      .from('ic_web_pages')
      .select('*, ic_web_seo_meta(*)')
      .eq('language', language)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  getPageBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('ic_web_pages')
      .select('*, ic_web_seo_meta(*)')
      .eq('slug', slug)
      .single()

    return { data, error }
  },

  // Navigation
  getNavigation: async (menuKey = 'main', language = 'en') => {
    const { data, error } = await supabase
      .from('ic_web_navigation')
      .select('*')
      .eq('menu_key', menuKey)
      .eq('language', language)
      .eq('is_active', true)
      .order('order_position', { ascending: true })

    return { data, error }
  },

  // Site Settings
  getSiteSettings: async () => {
    const { data, error } = await supabase
      .from('ic_web_site_settings')
      .select('*')

    return { data, error }
  },

  getSetting: async (key) => {
    const { data, error } = await supabase
      .from('ic_web_site_settings')
      .select('value')
      .eq('key', key)
      .single()

    return { data: data?.value, error }
  }
}
