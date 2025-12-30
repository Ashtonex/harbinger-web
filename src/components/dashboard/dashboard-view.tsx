"use client"

import { Container, Grid, Title, Text, Group, Paper, Stack, Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react"; 

// --- COMPONENTS ---
import { QuickActions } from "@/components/dashboard/quick-actions"
import { EventCountdown } from "@/components/dashboard/event-countdown"
import { CompletenessWidget } from "@/components/gamification/completeness-widget"
import { BadgeList } from "@/components/gamification/badge-list"
import { ResumeActivityCard } from "@/components/dashboard/resume-activity-card"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { TransactionHistory } from "@/components/dashboard/transaction-history"

interface DashboardViewProps {
  userConfig: any;
  nextEvent: any;
  completeness: any;
  recentActivity: any[];
  userBadges: any[];
  weeklyStats: any[];
  suggestions: any;
}

export function DashboardView({ 
  userConfig, 
  nextEvent, 
  completeness, 
  recentActivity, 
  userBadges, 
  weeklyStats, 
  suggestions 
}: DashboardViewProps) {
  
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        
        {/* HEADER */}
        <Group justify="space-between" align="flex-end">
          <div>
            {/* FIXED: Gradient logic moved to inner Text component for Mantine v7 */}
            <Title order={1}>
              <Text 
                span 
                inherit 
                variant="gradient" 
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              >
                Dashboard
              </Text>
            </Title>
            <Text c="dimmed" mt="xs">
              Welcome back. Here is a snapshot of your spiritual journey this week.
            </Text>
          </div>
          <Button leftSection={<IconDownload size={16} />} variant="light">
            Export Report
          </Button>
        </Group>

        {/* RESUME ACTIVITY */}
        <Stack gap="sm">
          {/* FIXED: ls="1px" moved to style */}
          <Text tt="uppercase" c="dimmed" fw={700} size="xs" style={{ letterSpacing: '1px' }}>
            Continue Watching
          </Text>
          <Grid gutter="md">
            {recentActivity && recentActivity.map((item: any) => (
              <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 4 }}>
                <ResumeActivityCard data={item} />
              </Grid.Col>
            ))}
          </Grid>
        </Stack>

        {/* MAIN GRID LAYOUT */}
        <Grid gutter="lg">
          
          {/* LEFT COLUMN (Main Content) */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">
              
              {/* Quick Actions */}
              <Paper shadow="xs" radius="md" p="lg" withBorder>
                <Title order={3} size="h4" mb="md">Quick Actions</Title>
                <QuickActions userConfig={userConfig} />
              </Paper>

              {/* Activity & Finances */}
              {/* FIXED: Moved overflow="hidden" to style prop */}
              <Paper shadow="xs" radius="md" withBorder style={{ overflow: "hidden" }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--mantine-color-default-border)' }}>
                  <Title order={3} size="h4">Activity & Finances</Title>
                  <Text size="sm" c="dimmed">Your engagement and contributions.</Text>
                </div>
                
                <Stack p="lg" gap="xl">
                  <div style={{ height: 320, width: '100%' }}>
                    <ActivityChart data={weeklyStats || []} />
                  </div>
                  
                  <div>
                      <Group justify="space-between" mb="md">
                         <Title order={4} size="h5">Recent Transactions</Title>
                         <Button variant="subtle" size="xs">View all</Button>
                      </Group>
                      <TransactionHistory /> 
                  </div>
                </Stack>
              </Paper>

              {/* Recommendations */}
              <Stack gap="sm">
                  <Title order={3} size="h4">Recommended for You</Title>
                  <Grid gutter="md">
                     {suggestions?.items?.length > 0 ? (
                       suggestions.items.map((item: any) => (
                         <Grid.Col key={item.id} span={{ base: 12, md: 6 }}>
                           <Paper p="md" withBorder radius="md" style={{ cursor: 'pointer' }}>
                             <Text size="xs" c="blue" fw={700} tt="uppercase">Based on your history</Text>
                             <Text fw={600} mt={4}>{item.title}</Text>
                           </Paper>
                         </Grid.Col>
                       ))
                     ) : (
                       <Grid.Col span={12}>
                         <Paper p="xl" withBorder style={{ borderStyle: 'dashed', textAlign: 'center' }}>
                            <Text c="dimmed" fs="italic">Read more content to unlock personalized recommendations.</Text>
                         </Paper>
                       </Grid.Col>
                     )}
                  </Grid>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* RIGHT COLUMN (Sidebar) */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              
              <CompletenessWidget data={completeness} />

              <Paper p="lg" radius="md" withBorder bg="var(--mantine-color-gray-0)">
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="md">Spiritual Milestones</Text>
                  <BadgeList badges={userBadges} />
              </Paper>

              <Stack gap="xs">
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">Upcoming Gathering</Text>
                  {nextEvent ? (
                     <EventCountdown event={nextEvent} />
                  ) : (
                     <Paper p="xl" withBorder style={{ borderStyle: 'dashed', textAlign: 'center' }}>
                        <Text size="sm" c="dimmed">No upcoming events.</Text>
                     </Paper>
                  )}
              </Stack>

            </Stack>
          </Grid.Col>

        </Grid>
      </Stack>
    </Container>
  )
}