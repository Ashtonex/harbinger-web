"use client"; // Needs to be client-side to listen to context

import { useEffect, useState } from "react";
import { Container, Title, SimpleGrid, Card, Text, Group, Badge, ThemeIcon, Button, Alert } from "@mantine/core";
import Link from "next/link";
import { IconBook, IconBroadcast } from "@tabler/icons-react";
import { supabase } from "@/utils/supabase/client"; // Use client import
import { useLiveSync } from "@/context/live-sync-context"; // Import the Live Context

export default function BibleLibrary() {
  const { isLive, currentVerse } = useLiveSync(); // <--- Connect to Live Signal
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books on the client side
  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase
        .from("books")
        .select("*")
        .order("order_index", { ascending: true });
      
      if (data) setBooks(data);
      setLoading(false);
    };

    fetchBooks();
  }, []);

  if (loading) return <Container><Text>Loading Library...</Text></Container>;

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb={20}>The Holy Bible</Title>
      
      {/* 🔴 LIVE SERVICE ALERT (Only shows when Bishop is active) */}
      {isLive && currentVerse && (
        <Alert 
            variant="filled" 
            color="red" 
            title="Live Service in Session" 
            icon={<IconBroadcast />}
            mb={30}
        >
            <Group justify="space-between" align="center">
                <Text size="sm" c="white">
                    The pulpit is currently at <strong>{currentVerse}</strong>.
                </Text>
                <Button 
                    variant="white" 
                    color="red" 
                    size="xs"
                    component={Link}
                    // Extract Book and Chapter for the link (Simple parser)
                    href={`/bible/${currentVerse.split(' ')[0]}/${currentVerse.split(':')[0].split(' ').pop()}`}
                >
                    Join Live Reading
                </Button>
            </Group>
        </Alert>
      )}

      {/* OLD TESTAMENT */}
      <Group mb="md">
        <Badge size="lg" color="blue">Old Testament</Badge>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg" mb={40}>
        {books.filter(b => b.testament === 'Old').map((book) => (
          <Link 
            key={book.id} 
            href={`/bible/${book.name}/1`} 
            style={{ textDecoration: 'none' }}
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{book.name}</Text>
                <ThemeIcon variant="light" color="blue"><IconBook size={16} /></ThemeIcon>
              </Group>
            </Card>
          </Link>
        ))}
      </SimpleGrid>

      {/* NEW TESTAMENT */}
      <Group mb="md">
        <Badge size="lg" color="red">New Testament</Badge>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
        {books.filter(b => b.testament === 'New').map((book) => (
          <Link 
            key={book.id} 
            href={`/bible/${book.name}/1`} 
            style={{ textDecoration: 'none' }}
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
              <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{book.name}</Text>
                <ThemeIcon variant="light" color="red"><IconBook size={16} /></ThemeIcon>
              </Group>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}