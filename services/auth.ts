import { createClient } from '@/lib/supabase/client'
import { toast } from 'react-hot-toast'

export const authService = {
  async signUp(email: string, pass: string, name: string) {
    const supabase = createClient()
    
    // 1. Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name
        }
      }
    })

    if (error) {
      toast.error(error.message)
      return { data: null, error }
    }

    if (data.user) {
      // 2. Create profile with upsert to be safe
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          name: name,
          role: 'user' // default role
        }, { onConflict: 'id' })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        // We don't necessarily want to fail signup if profile creation fails, 
        // but it's critical for role-based access.
      } else {
        toast.success('Account created! Please check your email for verification.')
      }
    }

    return { data, error: null }
  },

  async signIn(email: string, pass: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged in successfully')
    }

    return { data, error }
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out')
      window.location.href = '/'
    }
  },

  async getSession() {
    const supabase = createClient()
    return await supabase.auth.getSession()
  },

  async getProfile(userId: string) {
    const supabase = createClient()
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
  }
}
