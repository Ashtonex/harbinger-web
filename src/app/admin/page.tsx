"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { 
  Container, TextInput, Button, Title, Paper, Text, 
  Group, Badge, Card, Divider, SimpleGrid, ThemeIcon 
} from "@mantine/core";
import { 
  IconBroadcast, IconSearch, IconCoin, IconUsers, IconBook, IconArrowRight 
} from "@tabler/icons-react";
import Link from "next/link";

export default function AdminBroadcaster() {
  // Input State
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  // 1. Search for the verse first (Verify it exists)
  const handlePreview = async () => {
    if (!query.includes(" ")) return; // Simple validation
    
    // Simple parser: "John 3:16" -> Book="John", Chapter=3, Verse=16
    const parts = query.split(/[: ]+/); 
    const verseNum = parseInt(parts.pop() || "0");
    const chapterNum = parseInt(parts.pop() || "0");
    const bookName = parts.join(" ");

    setLoading(true);
    
    // Find Book ID
    const { data: book } = await supabase
      .from("books")
      .select("id")
      .ilike("name", bookName) // Case-insensitive match
      .single();

    if (!book) {
      alert("Book not found!");
      setLoading(false);
      return;
    }

    // Find Verse Text
    const { data: verse } = await supabase
      .from("verses")
      .select("*")
      .eq("book_id", book.id)
      .eq("chapter", chapterNum)
      .eq("verse", verseNum)
      .single();

    if (verse) {
      setPreview({ ...verse, bookName });
    } else {
      alert("Verse not found.");
      setPreview(null);
    }
    setLoading(false);
  };

  // 2. THE BROADCAST SIGNAL
  const handleBroadcast = async () => {
    if (!preview) return;
    setBroadcasting(true);

    const channel = supabase.channel('live-service');

    await channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.send({
          type: 'broadcast',
          event: 'pulpit_verse',
          payload: { 
            book: preview.bookName, 
            chapter: preview.chapter, 
            verse: preview.verse, 
            text: preview.text 
          },
        });
        
        supabase.removeChannel(channel);
        setBroadcasting(false);
        alert(`🚀 LIVE: ${preview.bookName} ${preview.chapter}:${preview.verse} sent to all devices!`);
      }
    });
  };

  return (
    <Container size="sm" py="xl">
      
      {/* --- SECTION 1: LIVE BROADCASTER --- */}
      <Card shadow="lg" p="xl" radius="md" withBorder mb={50}>
        <Title order={3} mb="xl" ta="center">📢 Pulpit Broadcaster</Title>

        {/* INPUT SECTION */}
        <Text size="sm" fw={500} mb={5}>Enter Reference (e.g. John 3 16)</Text>
        <Group>
          <TextInput 
            placeholder="John 3 16" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            style={{ flex: 1 }}
          />
          <Button onClick={handlePreview} loading={loading} variant="light">
            <IconSearch size={16} />
          </Button>
        </Group>

        <Divider my="lg" />

        {/* PREVIEW SECTION */}
        {preview ? (
          <Paper bg="gray.1" p="md" radius="md">
            <Badge color="blue" mb="xs">PREVIEW</Badge>
            <Text fw={700} size="lg">{preview.bookName} {preview.chapter}:{preview.verse}</Text>
            <Text size="md" fs="italic" mt="xs">"{preview.text}"</Text>

            <Button 
              fullWidth 
              size="lg" 
              color="red" 
              mt="xl" 
              loading={broadcasting}
              leftSection={<IconBroadcast />}
              onClick={handleBroadcast}
              className="animate-pulse"
            >
              GO LIVE
            </Button>
          </Paper>
        ) : (
          <Text c="dimmed" fs="italic" ta="center" size="sm">
            Preview a verse to broadcast it.
          </Text>
        )}
      </Card>

      {/* --- SECTION 2: ADMIN TOOLS (NEW) --- */}
      <Title order={4} mb="md" c="dimmed">Admin Control Panel</Title>
      
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {/* FINANCE LINK */}
        <Link href="/admin/finance" style={{ textDecoration: 'none' }}>
          <Card shadow="sm" p="lg" radius="md" withBorder h="100%">
            <ThemeIcon color="green" variant="light" size="xl" mb="md">
              <IconCoin size={24} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb={5}>Treasury</Text>
            <Text size="sm" c="dimmed" mb="md">View tithes, offerings, and export CSV reports.</Text>
            <Group justify="flex-end"><IconArrowRight size={16} color="gray" /></Group>
          </Card>
        </Link>

        {/* USERS LINK */}
        <Link href="/admin/users" style={{ textDecoration: 'none' }}>
          <Card shadow="sm" p="lg" radius="md" withBorder h="100%">
            <ThemeIcon color="blue" variant="light" size="xl" mb="md">
              <IconUsers size={24} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb={5}>People</Text>
            <Text size="sm" c="dimmed" mb="md">Manage congregation, roles, and moderation.</Text>
            <Group justify="flex-end"><IconArrowRight size={16} color="gray" /></Group>
          </Card>
        </Link>

        {/* CONTENT LINK */}
        <Link href="/admin/content" style={{ textDecoration: 'none' }}>
          <Card shadow="sm" p="lg" radius="md" withBorder h="100%">
            <ThemeIcon color="orange" variant="light" size="xl" mb="md">
              <IconBook size={24} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb={5}>Content</Text>
            <Text size="sm" c="dimmed" mb="md">Update Verse of the Day and announcements.</Text>
            <Group justify="flex-end"><IconArrowRight size={16} color="gray" /></Group>
          </Card>
        </Link>
      </SimpleGrid>

    </Container>
  );
}