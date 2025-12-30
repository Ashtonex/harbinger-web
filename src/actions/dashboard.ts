'use server'
import { createClient } from "@/utils/supabase/server"

export async function getRecentActivity() {
  // FIXED: Added 'await'
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

export async function getWeeklyStats() {
  // FIXED: Added 'await'
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // FIXED: Return an empty ARRAY [], not an object, if no user
  if (!user) return []

  // IMPORTANT: The chart expects an ARRAY of data points.
  // Returning mock data allows the UI to render without crashing.
  // TODO: Replace this with a real SQL aggregation query in Phase 10.
  return [
    { day: 'Mon', notes: 2, prayers: 1 },
    { day: 'Tue', notes: 4, prayers: 2 },
    { day: 'Wed', notes: 1, prayers: 0 },
    { day: 'Thu', notes: 3, prayers: 3 },
    { day: 'Fri', notes: 5, prayers: 2 },
    { day: 'Sat', notes: 2, prayers: 1 },
    { day: 'Sun', notes: 4, prayers: 3 },
  ]
}

export async function getSuggestions() {
  // FIXED: Added 'await'
  const supabase = await createClient()
  
  // Just a static example or DB fetch
  return [
    { id: 1, title: "Join the Choir", type: "community" },
    { id: 2, title: "Read Psalm 23", type: "devotional" }
  ]
}
