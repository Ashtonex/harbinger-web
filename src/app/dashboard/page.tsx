import { createClient } from "@/utils/supabase/server"
import { Container, Stack } from "@mantine/core"

// --- ACTIONS ---
import { getNextEvent } from "@/actions/events"
import { getProfileCompleteness, getUserBadges } from "@/actions/gamification"
import { getRecentActivity, getWeeklyStats } from "@/actions/dashboard"
import { getSuggestions } from "@/actions/recommendations"

// --- VIEW COMPONENTS ---
import { DashboardView } from "@/components/dashboard/dashboard-view"
// 1. New Import: The Remote Control
import { AdminBroadcaster } from "@/components/admin/broadcaster"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch ALL Data in Parallel
  // Added 'role' to the profile selection so we can check permissions (optional)
  const [profileResponse, nextEvent, completeness, recentActivity, userBadges, weeklyStats, suggestions] = await Promise.all([
    supabase.from('profiles').select('dashboard_config, role').eq('id', user?.id).single(),
    getNextEvent(),
    getProfileCompleteness(),
    getRecentActivity(),
    getUserBadges(),
    getWeeklyStats(),
    getSuggestions()
  ])

  const config = profileResponse.data?.dashboard_config?.quick_actions || []
  
  // Optional: Check if user is allowed to broadcast (Bishop/Admin)
  // You can adjust this condition based on your database 'role' values
  const canBroadcast = true // profileResponse.data?.role === 'admin' || profileResponse.data?.role === 'bishop'

  // Pass data to the Client Component View
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        
        {/* 2. PLACE THE BROADCASTER HERE */}
        {/* Only visible to the 'Bishop' or Admins */}
        {canBroadcast && (
           <AdminBroadcaster />
        )}

        <DashboardView 
          userConfig={config}
          nextEvent={nextEvent}
          completeness={completeness}
          recentActivity={recentActivity}
          userBadges={userBadges}
          weeklyStats={weeklyStats}
          suggestions={suggestions}
        />
      </Stack>
    </Container>
  )
}