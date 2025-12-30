"use client";

import { useState } from "react";
import { Paper, TextInput, Button, Title, Group, Badge } from "@mantine/core";
import { IconBroadcast, IconSend } from "@tabler/icons-react";
import { useLiveSync } from "@/context/live-sync-context";

export function AdminBroadcaster() {
  const { broadcastVerse } = useLiveSync();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;
    setLoading(true);
    
    // Send Signal
    await broadcastVerse(input);
    
    setLoading(false);
    setInput(""); // Clear input on success
  };

  return (
    <Paper withBorder p="md" radius="md" bg="gray.0">
      <Group justify="space-between" mb="md">
        <Title order={4}>Pulpit Broadcaster</Title>
        <Badge color="red" leftSection={<IconBroadcast size={10} />}>ON AIR</Badge>
      </Group>

      <Group>
        <TextInput 
          placeholder="e.g. John 3:16" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button 
          onClick={handleSend} 
          loading={loading}
          leftSection={<IconSend size={16} />}
          color="red"
        >
          Sync
        </Button>
      </Group>
    </Paper>
  );
}