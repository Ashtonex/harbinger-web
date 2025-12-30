'use server'
import { createClient } from '@/utils/supabase/server'

export async function getDraftNotes() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('sermon_notes')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'draft') // This uses the new column we added!
    .order('last_edited_at', { ascending: false })

  return data || []
}