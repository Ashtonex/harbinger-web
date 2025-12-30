"use client";

import { Container, Group, ActionIcon, Text, Divider, Stack } from "@mantine/core";
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconBrandFacebook } from "@tabler/icons-react";
import Link from "next/link";

export function AppFooter() {
  const links = [
    { link: "/bible", label: "Read the Bible" },
    { link: "/prayers", label: "Submit Prayer" },
    { link: "/give", label: "Tithes & Offering" },
    { link: "/login", label: "Member Login" },
  ];

  return (
    <div style={{ marginTop: 100, borderTop: '1px solid #eaeaea', backgroundColor: '#f8f9fa' }}>
      <Container size="lg" py="xl">
        <Group justify="space-between" align="start">
          
          {/* COLUMN 1: BRAND */}
          <Stack gap="xs" style={{ maxWidth: 300 }}>
            <Text fw={700} size="lg">HARBINGER</Text>
            <Text size="sm" c="dimmed">
              The digital tabernacle. Connecting the congregation through word, prayer, and community.
            </Text>
          </Stack>

          {/* COLUMN 2: LINKS */}
          <Stack gap="xs">
            <Text fw={700} mb={5}>Quick Links</Text>
            {links.map((link) => (
              <Link 
                key={link.label} 
                href={link.link}
                style={{ textDecoration: 'none', color: 'gray', fontSize: '14px' }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* COLUMN 3: SOCIALS */}
          <Stack gap="xs">
            <Text fw={700} mb={5}>Connect</Text>
            <Group gap="xs">
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandFacebook size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandTwitter size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandYoutube size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon size="lg" color="gray" variant="subtle">
                <IconBrandInstagram size={18} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Stack>
        </Group>

        <Divider my="xl" />

        <Group justify="space-between">
          <Text c="dimmed" size="xs">
            © {new Date().getFullYear()} Harbinger App. All rights reserved.
          </Text>
          
          <Group gap="xs">
            <Text c="dimmed" size="xs">Privacy</Text>
            <Text c="dimmed" size="xs">•</Text>
            <Text c="dimmed" size="xs">Terms</Text>
          </Group>
        </Group>
      </Container>
    </div>
  );
}