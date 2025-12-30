"use client"

import { useState } from "react"
import { 
  Card, Text, Group, Tabs, Button, Stack, ThemeIcon, 
  Badge, Paper, ScrollArea, Center 
} from "@mantine/core"
import { IconBell, IconCheck, IconHeart, IconMessageCircle } from "@tabler/icons-react"
import { markNotificationRead } from "@/actions/notifications"

// Mock type - replace with your Supabase generated type if available
type Notification = {
  id: string
  type: 'amen' | 'announcement' | 'message' | string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function InboxWidget({ initialData = [] }: { initialData?: Notification[] }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialData)
  const [activeTab, setActiveTab] = useState<string | null>('all')

  const handleDismiss = async (id: string) => {
    // 1. Optimistic Update (Remove from UI immediately)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    // 2. Server Update
    await markNotificationRead(id)
  }

  const handleAction = async (id: string, type: string) => {
    // Custom logic: e.g., if "Amen", maybe send a "Thanks" back
    console.log(`Action taken on ${type}`)
    handleDismiss(id) // Auto-dismiss after action
  }

  // Icon Helper
  const getIcon = (type: string) => {
    switch (type) {
      case 'amen': return <IconHeart size={16} />;
      case 'announcement': return <IconBell size={16} />;
      default: return <IconMessageCircle size={16} />;
    }
  }

  // Color Helper
  const getColor = (type: string) => {
    switch (type) {
      case 'amen': return 'pink';
      case 'announcement': return 'orange';
      default: return 'blue';
    }
  }

  const unreadCount = notifications.length

  return (
    <Card shadow="sm" radius="md" withBorder padding="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Text fw={700} size="lg">Inbox</Text>
          {unreadCount > 0 && (
            <Badge color="red" size="sm" variant="filled">{unreadCount} Unread</Badge>
          )}
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List mb="md" grow>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="amen">Prayers</Tabs.Tab>
          <Tabs.Tab value="announcement">Updates</Tabs.Tab>
        </Tabs.List>

        {["all", "amen", "announcement"].map((tab) => (
          <Tabs.Panel key={tab} value={tab}>
            <ScrollArea h={300} type="auto" offsetScrollbars>
                <Stack gap="sm">
                  {notifications
                    .filter((n) => tab === "all" || n.type === tab)
                    .map((n) => (
                    <Paper key={n.id} p="sm" withBorder bg="var(--mantine-color-body)">
                      <Group justify="space-between" align="start" wrap="nowrap">
                        <Group align="start" wrap="nowrap" style={{ flex: 1 }}>
                          <ThemeIcon size="lg" radius="xl" variant="light" color={getColor(n.type)}>
                            {getIcon(n.type)}
                          </ThemeIcon>
                          
                          <div style={{ flex: 1 }}>
                            <Text size="sm" fw={600} lh={1.2}>{n.title}</Text>
                            <Text size="xs" c="dimmed" lineClamp={2} mt={2}>{n.message}</Text>
                            
                            {/* INLINE ACTIONS */}
                            <Group mt="xs" gap="xs">
                              {n.type === 'amen' && (
                                <Button 
                                  size="compact-xs" 
                                  variant="light" 
                                  color="pink"
                                  onClick={() => handleAction(n.id, 'amen')}
                                >
                                  Receive Prayer
                                </Button>
                              )}
                              <Button 
                                size="compact-xs" 
                                variant="subtle" 
                                color="gray"
                                onClick={() => handleDismiss(n.id)}
                              >
                                Dismiss
                              </Button>
                            </Group>
                          </div>
                        </Group>

                        <Stack align="flex-end" gap={4}>
                           <Text size="xs" c="dimmed" style={{ fontSize: 10 }}>2m ago</Text>
                           {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--mantine-color-blue-5)' }} />}
                        </Stack>
                      </Group>
                    </Paper>
                  ))}
                  
                  {notifications.filter((n) => tab === "all" || n.type === tab).length === 0 && (
                     <Center py={40}>
                       <Stack align="center" gap="xs">
                         <IconCheck size={32} style={{ opacity: 0.2 }} />
                         <Text c="dimmed" size="sm">You are all caught up!</Text>
                       </Stack>
                     </Center>
                  )}
                </Stack>
            </ScrollArea>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Card>
  )
}