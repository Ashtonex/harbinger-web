'use server'
import { createClient } from "@/utils/supabase/server"

export async function getProfileCompleteness() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { score: 0, missing: [] }

  // 1. Fetch Profile & Counts in parallel
  const [profileResponse, notesCount, prayersCount] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    // FIXED: Changed 'notes' to 'sermon_notes' to match your DB schema
    supabase.from('sermon_notes').select('id', { count: 'exact', head: true }).eq('user_id', user.id), 
    supabase.from('prayers').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
  ])

  const profile = profileResponse.data || {}
  const notes = notesCount.count || 0
  const prayers = prayersCount.count || 0

  // 2. Calculate Score
  let score = 0
  const missing: string[] = []

  // Basic Profile (40%)
  // Using optional chaining (?) in case profile fields are null
  if (profile?.first_name && profile?.last_name) score += 10
  else missing.push("Add Name")
  
  if (profile?.avatar_url) score += 10
  else missing.push("Upload Photo")

  if (profile?.bio) score += 10
  else missing.push("Write Bio")

  if (profile?.city) score += 10
  else missing.push("Add Location")

  // Activity (60%)
  if (notes > 0) score += 30
  else missing.push("Create First Note")

  if (prayers > 0) score += 30
  else missing.push("Post Prayer Request")

  return { score, missing }
}

export async function getRecentActivity() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}

export async function getUserBadges() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('user_badges')
    .select('*, badge:badges(*)')
    .eq('user_id', user.id)

  return data || []
}
