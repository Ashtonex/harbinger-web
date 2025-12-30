// src/app/profile/ProfileView.tsx
"use client"

import {
  Container, Paper, Avatar, Title, Text, Group,
  Button, Grid, Badge, Stack, ThemeIcon, Divider, Center
} from "@mantine/core"
import {
  IconPencil, IconMapPin, IconCake,
  IconPhone, IconUser, IconHeart, IconPlus
} from "@tabler/icons-react"
import Link from "next/link"

function getAge(dateString?: string) {
  if (!dateString) return null
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export default function ProfileView({ user, profile }: any) {

  if (!profile) {
    return (
      <Container size="sm" py="xl">
        <Center h="50vh">
          <Stack align="center">
            <Avatar size={100} radius={100} color="blue">
              {user?.email?.[0]}
            </Avatar>

            <Title order={3}>
              Welcome, {user?.email?.split("@")[0]}!
            </Title>

            <Text c="dimmed" ta="center">
              You haven't set up your profile yet.
            </Text>

            <Button
              component={Link}
              href="/profile/edit"
              leftSection={<IconPlus size={16} />}
            >
              Create Profile
            </Button>
          </Stack>
        </Center>
      </Container>
    )
  }

  const fullName = profile.first_name
    ? `${profile.first_name} ${profile.last_name}`
    : "Anonymous User"

  const age = getAge(profile.birthday)

  return (
    <Container size="md" py="xl">
      {/* FIXED: Moved overflow="hidden" to style prop */}
      <Paper radius="md" withBorder shadow="sm" style={{ overflow: "hidden" }}>

        <div style={{
          height: 140,
          background: "linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-6))"
        }} />

        <div style={{ padding: 32, marginTop: -60 }}>
          <Group justify="space-between" align="flex-end" wrap="nowrap">
            <Group align="flex-end">
              <Avatar
                src={profile.avatar_url}
                size={120}
                radius={120}
                style={{ border: "4px solid white" }}
              >
                {profile.first_name?.[0] || user?.email?.[0]}
              </Avatar>

              <div>
                <Title order={2}>{fullName}</Title>
                <Text c="dimmed" size="sm">
                  @{user?.email?.split("@")[0]}
                </Text>
              </div>
            </Group>

            <Button
              component={Link}
              href="/profile/edit"
              variant="default"
              leftSection={<IconPencil size={16} />}
            >
              Edit Profile
            </Button>
          </Group>

          {/* rest of your layout stays unchanged */}
        </div>
      </Paper>
    </Container>
  )
}