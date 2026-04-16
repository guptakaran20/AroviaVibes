"use server"

import { createClient } from '@/lib/supabase/server'


export async function signUp(email: string, pass: string, name: string) {
  const supabase = await createClient()
  
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
    return { data: null, error: error.message }
  }

  if (data.user) {
    // 2. Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        name: name,
        role: 'user'
      }, { onConflict: 'id' })

    if (profileError) {
      console.error('Error creating profile:', profileError)
    }
  }

  return { data, error: null }
}

export async function signIn(email: string, pass: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass
  })

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function getSession() {
  const supabase = await createClient()
  return await supabase.auth.getSession()
}

export async function getProfile(userId: string) {
  const supabase = await createClient()
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

/**
 * Ensures a profile exists for the user. 
 * If it doesn't, it creates one using user_metadata.
 */
export async function ensureProfile(userId: string, userMetadata?: any) {
  const supabase = await createClient()
  
  // 1. Try to get existing profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profile && profile.name) {
    return { data: profile, error: null }
  }

  // 2. If profile missing (or name missing), try to create/update it
  const nameFromMetadata = userMetadata?.full_name || userMetadata?.name
  
  if (nameFromMetadata) {
    const { data: updatedProfile, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: nameFromMetadata,
        role: profile?.role || 'user'
      }, { onConflict: 'id' })
      .select()
      .single()

    if (upsertError) {
      console.error('Error syncing profile:', upsertError)
      return { data: profile, error: upsertError.message }
    }

    return { data: updatedProfile, error: null }
  }

  return { data: profile, error: error?.message }
}

export async function resetPasswordForEmail(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.SITE_URL}/auth/callback?next=/update-password`
  })
  
  if (error) return { error: error.message }
  return { error: null }
}

export async function updatePassword(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password
  })
  
  if (error) return { error: error.message }
  return { error: null }
}

export async function updateProfile(userId: string, data: { name?: string; pincode?: string; phone?: string }) {
  const supabase = await createClient()
  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single()

  return { data: updatedProfile, error: error?.message }
}


