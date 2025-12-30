"use client"

import { useState } from "react"
import { 
  Container, Title, Text, Button, Paper, Group, 
  SimpleGrid, TextInput, Badge, ActionIcon, Stack, 
  Tabs, ThemeIcon, rem 
} from "@mantine/core"
import { 
  IconSearch, IconPlus, IconDotsVertical, 
  IconBook, IconMicrophone, IconPencil, IconTag 
} from "@tabler/icons-react"

// Mock data to demonstrate diversity
const INITIAL_NOTES = [
  { 
    id: 1, 
    title: "Walking in Faith", 
    preview: "Faith is not just believing, it is acting on that belief...", 
    date: "Dec 24, 2025", 
    category: "Sermon", 
    color: "blue",
    icon: IconBook 
  },
  { 
    id: 2, 
    title: "Romans 8 Study", 
    preview: "There is therefore now no condemnation for those who are...", 
    date: "Dec 20, 2025", 
    category: "Bible Study", 
    color: "cyan",
    icon: IconPencil
  },
  { 
    id: 3, 
    title: "Prayer Request: The Smiths", 
    preview: "Praying for healing and restoration for the family...", 
    date: "Dec 18, 2025", 
    category: "Prayer", 
    color: "grape",
    icon: IconMicrophone
  },
  { 
    id: 4, 
    title: "2026 Vision Goals", 
    preview: "Focus on community outreach and youth programs...", 
    date: "Dec 15, 2025", 
    category: "Personal", 
    color: "orange",
    icon: IconTag
  }
]

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState<string | null>("all")
  const [search, setSearch] = useState("")

  // Filter notes based on Search and Tab
  const filteredNotes = INITIAL_NOTES.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === "all" || note.category.toLowerCase().replace(" ", "-") === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        
        {/* HEADER SECTION */}
        <Group justify="space-between">
          <div>
            <Title order={2}>My Notes</Title>
            <Text c="dimmed" size="sm">Capture and organize your spiritual insights.</Text>
          </div>
          <Button leftSection={<IconPlus size={16} />} color="blue">
            New Note
          </Button>
        </Group>

        {/* CONTROLS: TABS & SEARCH */}
        <Group justify="space-between" align="center">
          <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
            <Tabs.List>
              <Tabs.Tab value="all">All Notes</Tabs.Tab>
              <Tabs.Tab value="sermon">Sermons</Tabs.Tab>
              <Tabs.Tab value="bible-study">Bible Study</Tabs.Tab>
              <Tabs.Tab value="prayer">Prayer</Tabs.Tab>
            </Tabs.List>
          </Tabs>
          
          <TextInput 
            placeholder="Search notes..." 
            leftSection={<IconSearch size={16} stroke={1.5} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ width: 300 }} 
          />
        </Group>

        {/* NOTES GRID */}
        {filteredNotes.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </SimpleGrid>
        ) : (
          <Paper p="xl" withBorder style={{ borderStyle: 'dashed', textAlign: 'center' }}>
            <Text c="dimmed">No notes found matching your criteria.</Text>
          </Paper>
        )}

      </Stack>
    </Container>
  )
}

// Sub-component for individual cards
function NoteCard({ note }: { note: any }) {
  const Icon = note.icon
  
  return (
    <Paper shadow="sm" radius="md" p="md" withBorder className="group hover:shadow-md transition-all">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
           <ThemeIcon color={note.color} variant="light" size="md" radius="md">
             <Icon size={16} />
           </ThemeIcon>
           <Text fw={600} lineClamp={1} size="sm">{note.title}</Text>
        </Group>
        <ActionIcon variant="subtle" color="gray">
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={3} mb="md" h={60}>
        {note.preview}
      </Text>

      <Group justify="space-between" mt="md">
        <Badge color={note.color} variant="dot" size="sm">
          {note.category}
        </Badge>
        <Text size="xs" c="dimmed">
          {note.date}
        </Text>
      </Group>
    </Paper>
  )
}