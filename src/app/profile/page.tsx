import { createClient } from "@/utils/supabase/server"
import { Container, Paper, Avatar, Title, Text, Group, Button, Grid, Badge, Stack, ThemeIcon, Divider, Center } from "@mantine/core"
import { IconPencil, IconMapPin, IconCake, IconPhone, IconUser, IconHeart, IconPlus } from "@tabler/icons-react"
import Link from "next/link"
// IMPORT THE LOGOUT BUTTON
import { LogoutButton } from "@/components/auth/logout-button"

function getAge(dateString: any) {
  if (!dateString) return null;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  return age;
}

export default async function ProfilePage() {
  const supabase = await createClient()
   
  const { data: { user } } = await supabase.auth.getUser()
   
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single()

  // 1. EMPTY STATE
  if (!profile) {
    return (
      <Container size="sm" py="xl">
        <Center h="50vh">
          <Stack align="center">
            <Avatar size={100} radius={100} color="blue">{user?.email?.[0]}</Avatar>
            <Title order={3}>Welcome, {user?.email?.split('@')[0]}!</Title>
            <Text c="dimmed" ta="center">You haven't set up your profile yet.</Text>
            
            <Link href="/profile/edit">
              <Button leftSection={<IconPlus size={16} />}>
                Create Profile
              </Button>
            </Link>
            
            {/* Added Logout here so users aren't trapped */}
            <LogoutButton />
          </Stack>
        </Center>
      </Container>
    )
  }

  const fullName = profile.first_name ? `${profile.first_name} ${profile.last_name}` : "Anonymous User"
  const age = getAge(profile.birthday)

  return (
    <Container size="md" py="xl">
      {/* FIXED: Moved overflow="hidden" to style prop */}
      <Paper radius="md" withBorder shadow="sm" style={{ overflow: "hidden" }}>
        
        {/* COVER BANNER */}
        <div style={{ height: 140, background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-cyan-6) 100%)' }}></div>

        <div style={{ padding: 'var(--mantine-spacing-xl)', marginTop: -60 }}>
          {/* HEADER */}
          <Group align="flex-end" justify="space-between" wrap="nowrap">
            <Group align="flex-end">
              <Avatar 
                src={profile.avatar_url} 
                size={120} 
                radius={120} 
                style={{ border: '4px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                color="blue"
              >
                {profile.first_name?.[0] || user?.email?.[0]}
              </Avatar>
              <div style={{ paddingBottom: 10 }}>
                <Title order={2}>{fullName}</Title>
                <Text c="dimmed" size="sm">@{user?.email?.split('@')[0]}</Text>
              </div>
            </Group>
            
            <Group>
              <Link href="/profile/edit">
                <Button variant="default" leftSection={<IconPencil size={16} />}>
                  Edit Profile
                </Button>
              </Link>

              {/* RESTORED LOGOUT BUTTON */}
              <LogoutButton />
            </Group>
          </Group>

          <Grid mt="xl" gutter="xl">
            {/* DETAILS */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Text tt="uppercase" fw={700} c="dimmed" size="xs" ls="md">Details</Text>
                
                <Group gap="sm">
                  <ThemeIcon variant="light" color="gray" size="md"><IconUser size={16} /></ThemeIcon>
                  <Text size="sm">{profile.gender || "Gender not set"}</Text>
                </Group>
                
                <Group gap="sm">
                  <ThemeIcon variant="light" color="pink" size="md"><IconHeart size={16} /></ThemeIcon>
                  <Text size="sm">{profile.marital_status || "Status not set"}</Text>
                </Group>
                
                <Group gap="sm">
                  <ThemeIcon variant="light" color="orange" size="md"><IconCake size={16} /></ThemeIcon>
                  <Text size="sm">
                    {profile.birthday ? `${new Date(profile.birthday).toLocaleDateString()} (${age} y/o)` : "Birthday not set"}
                  </Text>
                </Group>
                
                <Group gap="sm">
                  <ThemeIcon variant="light" color="green" size="md"><IconMapPin size={16} /></ThemeIcon>
                  <Text size="sm">
                    {profile.city ? `${profile.city}, ${profile.country || ""}` : "Location not set"}
                  </Text>
                </Group>

                <Divider my="sm" />

                <Text tt="uppercase" fw={700} c="dimmed" size="xs" ls="md">Contact</Text>
                  <Group gap="sm">
                  <ThemeIcon variant="light" color="blue" size="md"><IconPhone size={16} /></ThemeIcon>
                  <Text size="sm">{profile.phone || "No phone"}</Text>
                </Group>
              </Stack>
            </Grid.Col>

            {/* BIO */}
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="lg">
                  <div>
                    <Title order={4} mb="xs">About Me</Title>
                    <Text c={profile.bio ? "text" : "dimmed"} style={{ lineHeight: 1.6 }}>
                      {profile.bio || "This user hasn't written a bio yet."}
                    </Text>
                  </div>

                  <div>
                    <Title order={4} mb="xs">Spiritual Identity</Title>
                    <Group gap="xs">
                        <Badge size="lg" variant="dot" color="blue">Member</Badge>
                        <Badge size="lg" variant="outline" color="grape">Choir</Badge>
                        <Badge size="lg" variant="outline" color="orange">Volunteer</Badge>
                    </Group>
                  </div>
                </Stack>
            </Grid.Col>
          </Grid>
        </div>
      </Paper>
    </Container>
  )
}