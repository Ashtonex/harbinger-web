'use server'
import { createClient } from "@/utils/supabase/server"

export async function getNextEvent() {
  // FIXED: Added 'await' here
  const supabase = await createClient()

  const { data } = await supabase
    .from('events')
    .select('*')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(1)
    .maybeSingle() // Safe: returns null if no event is found, instead of crashing

  return data
}
