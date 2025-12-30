import { createClient } from "@/utils/supabase/server"

// --- ACTIONS ---
import { getNextEvent } from "@/actions/events"
import { getProfileCompleteness, getUserBadges } from "@/actions/gamification"
import { getRecentActivity, getWeeklyStats } from "@/actions/dashboard"
import { getSuggestions } from "@/actions/recommendations"

// --- VIEW COMPONENT ---
// This is the new file we created in Step 1
import { DashboardView } from "@/components/dashboard/dashboard-view"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch ALL Data in Parallel
  const [profileResponse, nextEvent, completeness, recentActivity, userBadges, weeklyStats, suggestions] = await Promise.all([
    supabase.from('profiles').select('dashboard_config').eq('id', user?.id).single(),
    getNextEvent(),
    getProfileCompleteness(),
    getRecentActivity(),
    getUserBadges(),
    getWeeklyStats(),
    getSuggestions()
  ])

  const config = profileResponse.data?.dashboard_config?.quick_actions || []

  // Pass data to the Client Component View
  return (
    <DashboardView 
      userConfig={config}
      nextEvent={nextEvent}
      completeness={completeness}
      recentActivity={recentActivity}
      userBadges={userBadges}
      weeklyStats={weeklyStats}
      suggestions={suggestions}
    />
  )
}