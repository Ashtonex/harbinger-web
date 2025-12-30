"use client"

import { useState } from "react"
import { 
  Popover, Button, Text, Stack, TextInput, ActionIcon, 
  Group, Divider, ScrollArea, Loader 
} from "@mantine/core"
import { IconBookmark, IconPlus, IconCheck } from "@tabler/icons-react"
import { createBookmark, createCollection } from "@/actions/bookmarks" 

interface BookmarkButtonProps {
  resourceId: string
  resourceType: string
  collections?: any[] // Optional list of existing collections
}

export function BookmarkButton({ resourceId, resourceType, collections = [] }: BookmarkButtonProps) {
  const [opened, setOpened] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (collectionId: string) => {
    setLoading(true)
    try {
        await createBookmark(collectionId, resourceId, resourceType)
        setSaved(true)
        // Close popover after a brief success delay
        setTimeout(() => {
            setSaved(false)
            setOpened(false)
        }, 1000)
    } catch (e) {
        console.error("Failed to bookmark", e)
    } finally {
        setLoading(false)
    }
  }

  const handleCreateAndSave = async () => {
    if (!newCollectionName) return
    setLoading(true)
    try {
        // Create collection (assuming logic handles creation)
        await createCollection(newCollectionName)
        setNewCollectionName("")
        setOpened(false)
    } catch (e) {
        console.error("Failed to create collection", e)
    } finally {
        setLoading(false)
    }
  }

  return (
    <Popover 
      width={280} 
      position="bottom-end" 
      withArrow 
      shadow="md" 
      opened={opened} 
      onChange={setOpened}
      trapFocus
    >
      <Popover.Target>
        <ActionIcon 
          variant={saved ? "filled" : "subtle"} 
          color={saved ? "green" : "gray"} 
          onClick={() => setOpened((o) => !o)}
          loading={loading}
        >
           {saved ? <IconCheck size={18} /> : <IconBookmark size={18} />}
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <Stack gap="sm">
            <Text size="sm" fw={700}>Save to Collection</Text>

            {/* LIST EXISTING COLLECTIONS */}
            {/* FIXED: 'mah' is the correct prop for max-height in Mantine v7 */}
            <ScrollArea.Autosize mah={200} type="auto">
                {collections.length > 0 ? (
                    <Stack gap={4}>
                        {collections.map((col: any) => (
                            <Button
                                key={col.id}
                                variant="subtle"
                                justify="start"
                                size="xs"
                                color="gray"
                                onClick={() => handleSave(col.id)}
                                disabled={loading}
                            >
                                {col.name}
                            </Button>
                        ))}
                    </Stack>
                ) : (
                    <Text size="xs" c="dimmed" ta="center" py="xs">
                        No collections found.
                    </Text>
                )}
            </ScrollArea.Autosize>

            <Divider />

            {/* CREATE NEW COLLECTION */}
            <Group gap={5} align="flex-end">
                <TextInput
                    placeholder="New Collection..."
                    size="xs"
                    label="Create New"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    style={{ flex: 1 }}
                />
                <ActionIcon 
                    variant="filled" 
                    color="blue" 
                    size="md"
                    mb={1} 
                    onClick={handleCreateAndSave} 
                    disabled={!newCollectionName || loading}
                >
                    <IconPlus size={16} />
                </ActionIcon>
            </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}