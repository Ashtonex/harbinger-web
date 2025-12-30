import { supabase } from "@/utils/supabase";
import { Container, Title, SimpleGrid, Card, Text, Group, Badge, ThemeIcon } from "@mantine/core";
import Link from "next/link";
import { IconBook } from "@tabler/icons-react";

// This page runs on the server (Server Component)
export default async function BibleLibrary() {
  // 1. Fetch all books sorted by their order
  const { data: books } = await supabase
    .from("books")
    .select("*")
    .order("order_index", { ascending: true });

  if (!books) return <Container><Text>Loading Library...</Text></Container>;

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb={40}>The Holy Bible</Title>
      
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