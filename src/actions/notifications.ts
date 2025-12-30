'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_read', false) // Only show unread for Inbox Zero
    .order('created_at', { ascending: false })
    .limit(20)

  return data || []
}

export async function markNotificationRead(notificationId: string) {
  const supabase = createClient()
  
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  revalidatePath('/dashboard') // Refresh the dashboard data
}