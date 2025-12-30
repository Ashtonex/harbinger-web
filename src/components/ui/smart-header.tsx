"use client"

import { usePathname, useRouter } from "next/navigation"
import { ActionIcon, Container, Group, Box } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"

export function SmartHeader() {
  const pathname = usePathname()
  const router = useRouter()

  // LIST OF PAGES WHERE WE DO NOT WANT A BACK BUTTON
  const hiddenRoutes = ["/dashboard", "/login", "/", "/admin"]

  // If the current page is in the list above, return nothing (null)
  if (hiddenRoutes.includes(pathname)) {
    return null
  }

  return (
    <Box py="md" bg="transparent">
      <Container size="xl">
        <Group>
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            size="lg" 
            radius="xl"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <IconArrowLeft size={24} />
          </ActionIcon>
        </Group>
      </Container>
    </Box>
  )
}