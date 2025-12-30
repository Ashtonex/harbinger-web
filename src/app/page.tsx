import { supabase } from "@/utils/supabase";
import { Container, Title, Text, Button, Paper, Group, SimpleGrid, ThemeIcon, Card, Badge, Divider } from "@mantine/core";
import { IconBook, IconPray, IconHeartHandshake, IconArrowRight, IconBroadcast, IconCalendarEvent, IconMapPin } from "@tabler/icons-react";
import Link from "next/link";

export const revalidate = 60; 

export default async function HomePage() {
  // 1. Fetch Verse of the Day
  const today = new Date().toISOString().split('T')[0];
  const { data: daily } = await supabase.from("daily_content").select("*").eq("date", today).single();

  // 2. Fetch Upcoming Events (Future dates only)
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte('date', new Date().toISOString()) // Only future events
    .order('date', { ascending: true })
    .limit(3);

  return (
    <Container size="lg" py="xl">
      
      {/* HERO SECTION */}
      <Paper p={50} radius="lg" mb={50} bg="blue.6" style={{ color: 'white' }}>
        <Group justify="space-between" align="flex-start">
            <div style={{ maxWidth: 500 }}>
                <Title size={48} fw={900} mb="md" style={{ lineHeight: 1.1 }}>Welcome to Harbinger.</Title>
                <Text size="xl" mb="xl" c="white" opacity={0.9}>
                  The digital tabernacle for the modern believer. 
                </Text>
                <Link href="/bible">
                    <Button size="lg" variant="white" color="blue" rightSection={<IconArrowRight size={18}/>}>
                        Start Reading
                    </Button>
                </Link>
            </div>
            
            {/* Verse Card */}
            <Card radius="md" p="xl" w={{ base: '100%', sm: 350 }} bg="white" c="black" shadow="sm">
                <Text tt="uppercase" size="xs" fw={700} c="dimmed" mb="sm">Verse of the Day</Text>
                {daily ? (
                    <>
                        <Text size="lg" fw={600} mb="xs">"{daily.verse_text}"</Text>
                        <Text ta="right" fs="italic" c="blue">— {daily.verse_ref}</Text>
                    </>
                ) : (
                    <Text fs="italic">"Thy word is a lamp unto my feet..." — Psalm 119:105</Text>
                )}
            </Card>
        </Group>
      </Paper>

      {/* ANNOUNCEMENTS SECTION (NEW) */}
      {events && events.length > 0 && (
        <div style={{ marginBottom: 50 }}>
            <Group mb="md" justify="space-between">
                <Title order={3}>📅 Upcoming Events</Title>
            </Group>
            
            <SimpleGrid cols={{ base: 1, sm: 3 }}>
                {events.map((evt) => (
                    <Card key={evt.id} withBorder shadow="sm" radius="md" padding="lg">
                        <Group justify="space-between" mb="xs">
                            <Badge color="red" variant="light">
                                {new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </Badge>
                            {evt.location && (
                                <Group gap={5}>
                                    <IconMapPin size={14} color="gray" />
                                    <Text size="xs" c="dimmed">{evt.location}</Text>
                                </Group>
                            )}
                        </Group>
                        <Text fw={700} size="lg" mt="xs">{evt.title}</Text>
                        <Text size="sm" c="dimmed" lineClamp={2} mt={5}>{evt.description}</Text>
                    </Card>
                ))}
            </SimpleGrid>
            <Divider my="xl" />
        </div>
      )}

      {/* QUICK ACTIONS */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        <Link href="/prayers" style={{ textDecoration: 'none' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <ThemeIcon size="xl" radius="md" color="orange" variant="light" mb="md"><IconPray /></ThemeIcon>
                <Text fw={700} size="lg">Prayer Wall</Text>
                <Text size="sm" c="dimmed">Join the community in prayer.</Text>
            </Card>
        </Link>
        <Link href="/give" style={{ textDecoration: 'none' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <ThemeIcon size="xl" radius="md" color="green" variant="light" mb="md"><IconHeartHandshake /></ThemeIcon>
                <Text fw={700} size="lg">Giving</Text>
                <Text size="sm" c="dimmed">Secure online tithes via Paynow.</Text>
            </Card>
        </Link>
        <Link href="/bible" style={{ textDecoration: 'none' }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <ThemeIcon size="xl" radius="md" color="blue" variant="light" mb="md"><IconBroadcast /></ThemeIcon>
                <Text fw={700} size="lg">Live Service</Text>
                <Text size="sm" c="dimmed">Follow the pulpit in real-time.</Text>
            </Card>
        </Link>
      </SimpleGrid>
    </Container>
  );
}