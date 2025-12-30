"use client";

import { useState, useEffect } from "react"; // <--- Added useEffect
import { AppShell, Burger, Group, Button, Title, Drawer, Stack, ThemeIcon, ActionIcon, useMantineColorScheme, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { 
  IconBook, IconPray, IconHeartHandshake, IconUser, IconLogout, IconDashboard, IconSun, IconMoon, IconSearch
} from "@tabler/icons-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/navigation";
import { Divider } from "@mantine/core";

export function AppNavbar({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure();
  const { user } = useAuth();
  const router = useRouter();
  
  // DARK MODE HOOKS
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  // HYDRATION FIX: Track mounting state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    close();
  };

  const menuItems = [
    { label: "Bible", icon: IconBook, link: "/bible", color: "blue" },
    { label: "Prayer Wall", icon: IconPray, link: "/prayers", color: "orange" },
    { label: "Give", icon: IconHeartHandshake, link: "/give", color: "green" },
    { label: "Dashboard", icon: IconDashboard, link: "/dashboard", color: "grape" },
  ];

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Title order={3} style={{ letterSpacing: 1 }}>HARBINGER</Title>
            </Link>
          </Group>

          {/* DESKTOP MENU */}
          <Group visibleFrom="sm">
             {/* SEARCH BUTTON */}
            <Link href="/search">
              <ActionIcon variant="default" size="lg" radius="xl">
                <IconSearch size={18} />
              </ActionIcon>
            </Link>

            {/* DARK MODE TOGGLE (FIXED) */}
            <ActionIcon onClick={toggleColorScheme} variant="default" size="lg" radius="xl">
               {/* Logic: If not mounted yet, default to Moon (Light mode default). 
                  Once mounted, check the actual computed scheme.
               */}
               {!mounted || computedColorScheme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
            </ActionIcon>

            <Divider orientation="vertical" />

            {menuItems.map((item) => (
              <Link key={item.label} href={item.link}>
                <Button variant="subtle" color="gray">{item.label}</Button>
              </Link>
            ))}
            
            {user ? (
              <Link href="/profile">
                  <ActionIcon variant="light" size="lg" radius="xl" color="blue">
                      <IconUser size={18}/>
                  </ActionIcon>
              </Link>
            ) : (
              <Link href="/login"><Button>Log In</Button></Link>
            )}
          </Group>

          {/* MOBILE RIGHT SIDE */}
          <Group hiddenFrom="sm">
             <Link href="/search">
              <ActionIcon variant="default" radius="xl"><IconSearch size={18} /></ActionIcon>
            </Link>
            <ActionIcon onClick={toggleColorScheme} variant="default" radius="xl">
               {!mounted || computedColorScheme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      {/* MOBILE DRAWER */}
      <Drawer opened={opened} onClose={close} size="xs" padding="md" title="Menu">
        <Stack gap="md">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.link} onClick={close} style={{ textDecoration: 'none' }}>
              <Group>
                <ThemeIcon color={item.color} variant="light"><item.icon size={18} /></ThemeIcon>
                <Title order={5} fw={500}>{item.label}</Title>
              </Group>
            </Link>
          ))}
          
          <Divider my="sm" />
          
          {user ? (
            <>
             <Link href="/profile" onClick={close} style={{ textDecoration: 'none' }}>
                <Group>
                  <ThemeIcon color="gray" variant="light"><IconUser size={18}/></ThemeIcon>
                  <Title order={5} fw={500}>My Profile</Title>
                </Group>
             </Link>
             <Button fullWidth color="red" variant="outline" mt="md" leftSection={<IconLogout size={16}/>} onClick={handleLogout}>
               Log Out
             </Button>
            </>
          ) : (
             <Link href="/login" onClick={close}>
               <Button fullWidth leftSection={<IconUser size={16}/>}>Log In</Button>
             </Link>
          )}
        </Stack>
      </Drawer>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}