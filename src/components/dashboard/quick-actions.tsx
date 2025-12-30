"use client"

import Link from "next/link"
import { SimpleGrid, UnstyledButton, Text, Group, ThemeIcon, Paper } from "@mantine/core"
import { IconCreditCard, IconBook, IconMessage, IconNote } from "@tabler/icons-react" 
// Fallback icons if needed
import { BookOpen, CreditCard, MessageSquare, StickyNote } from "lucide-react" 

const ACTIONS: Record<string, any> = {
  // 1. GIVE: Points to /give folder
  give: { label: "Give / Tithe", icon: CreditCard, color: "blue", href: "/give" },
  giving: { label: "Give / Tithe", icon: CreditCard, color: "blue", href: "/give" }, 

  // 2. BIBLE: Points to /bible folder
  bible: { label: "Read Bible", icon: BookOpen, color: "cyan", href: "/bible" },

  // 3. PRAYER: Now points strictly to the /prayers (plural) folder
  prayer: { label: "Prayer Wall", icon: MessageSquare, color: "grape", href: "/prayers" },
  prayers: { label: "Prayer Wall", icon: MessageSquare, color: "grape", href: "/prayers" },

  // 4. NOTES: Points to /notes folder
  notes: { label: "Sermon Notes", icon: StickyNote, color: "orange", href: "/notes" },
}

interface QuickActionsProps {
  userConfig: string[]
}

export function QuickActions({ userConfig }: QuickActionsProps) {
  const keys = userConfig?.length > 0 ? userConfig : ["give", "bible", "prayer", "notes"]

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }}>
      {keys.map((key) => {
        const action = ACTIONS[key] || ACTIONS.bible
        const Icon = action.icon

        return (
          <UnstyledButton component={Link} href={action.href} key={key}>
            <Paper withBorder p="md" radius="md" style={{ transition: 'background-color 0.2s' }} bg="var(--mantine-color-body)">
              <Group justify="center" mb="xs">
                <ThemeIcon size="lg" radius="xl" variant="light" color={action.color}>
                   <Icon size={20} />
                </ThemeIcon>
              </Group>
              <Text size="sm" fw={500} ta="center">
                {action.label}
              </Text>
            </Paper>
          </UnstyledButton>
        )
      })}
    </SimpleGrid>
  )
}