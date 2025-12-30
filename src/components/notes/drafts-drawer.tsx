"use client"

import { Drawer, Button, ScrollArea, Text, Group, Paper, Stack, ThemeIcon, Badge } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconFileText, IconClock, IconChevronRight } from "@tabler/icons-react"
import Link from "next/link"

// Mock Data Type
type Draft = {
  id: string
  title: string
  preview: string
  last_edited_at: string
}

export function DraftsDrawer({ drafts = [] }: { drafts: Draft[] }) {
  // Mantine hook to manage open/close state
  const [opened, { open, close }] = useDisclosure(false)

  // Helper to format date safely without external libraries
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      {/* TRIGGER BUTTON */}
      <Button 
        variant="outline" 
        onClick={open} 
        leftSection={<IconFileText size={16} />}
      >
        Open Drafts
        <Badge size="sm" variant="filled" color="gray" ml={8} circle>
          {drafts.length}
        </Badge>
      </Button>

      {/* DRAWER COMPONENT */}
      <Drawer 
        opened={opened} 
        onClose={close} 
        title={<Text fw={700} size="lg">Your Unfinished Notes</Text>}
        position="right"
        padding="md"
        size="md"
      >
        <ScrollArea h="calc(100vh - 80px)" type="auto">
          <Stack gap="sm">
            {drafts.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl" size="sm">
                No drafts found.
              </Text>
            ) : (
              drafts.map((draft) => (
                <Link 
                  key={draft.id} 
                  href={`/notes/edit/${draft.id}`}
                  style={{ textDecoration: 'none' }}
                  onClick={close} // Close drawer on navigation
                >
                  <Paper 
                    p="sm" 
                    withBorder 
                    style={{ 
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer'
                    }}
                    // Simulating hover effect via style logic or CSS module is ideal, 
                    // but simple prop usage works for basic structure.
                  >
                    <Group justify="space-between" align="start" wrap="nowrap">
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <Text fw={600} truncate>{draft.title || "Untitled Note"}</Text>
                        
                        <Text size="xs" c="dimmed" lineClamp={2} mt={4}>
                           {draft.preview || "No preview available..."}
                        </Text>

                        <Group gap={6} mt={8}>
                          <IconClock size={12} style={{ color: 'var(--mantine-color-dimmed)' }} />
                          <Text size="xs" c="dimmed" style={{ fontSize: 10 }}>
                            Edited {getTimeAgo(draft.last_edited_at)}
                          </Text>
                        </Group>
                      </div>
                      
                      <ThemeIcon variant="transparent" c="gray" mt={4}>
                        <IconChevronRight size={16} />
                      </ThemeIcon>
                    </Group>
                  </Paper>
                </Link>
              ))
            )}
          </Stack>
        </ScrollArea>
      </Drawer>
    </>
  )
}