import { createClient } from "@/utils/supabase/server"

export async function getSuggestions() {
  // FIXED: Added 'await' here
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // If no user, return generic suggestions
  if (!user) {
    return [
      {
        title: "Welcome to Harbinger",
        description: "Complete your profile to get started.",
        link: "/profile/edit",
        type: "system"
      }
    ]
  }

  // 1. Find what the user last read (e.g., "Psalms")
  const { data: lastActivity } = await supabase
    .from('activity_log')
    .select('details')
    .eq('user_id', user.id)
    .eq('action_type', 'bible_read')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // 2. Simple logic: If they read Psalms, suggest Proverbs. Otherwise, suggest Daily Devotion.
  // (You can make this smarter later)
  if (lastActivity?.details?.book === 'Psalms') {
    return [{
      title: "Continue with Proverbs",
      description: "Wisdom often follows worship. Read Proverbs 1.",
      link: "/bible/Proverbs/1",
      type: "scripture"
    }]
  }

  return [{
    title: "Daily Devotional",
    description: "Start your day with a moment of reflection.",
    link: "/devotional/today",
    type: "devotional"
  }]
}