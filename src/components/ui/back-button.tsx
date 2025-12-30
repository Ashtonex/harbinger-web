"use client"

import { useRouter } from "next/navigation"
import { Button, ActionIcon, Group } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"

interface BackButtonProps {
  label?: string
  variant?: "icon" | "button"
}

export function BackButton({ label = "Back", variant = "button" }: BackButtonProps) {
  const router = useRouter()

  if (variant === "icon") {
    return (
      <ActionIcon 
        variant="subtle" 
        color="gray" 
        size="lg" 
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <IconArrowLeft size={24} />
      </ActionIcon>
    )
  }

  return (
    <Button 
      variant="subtle" 
      color="gray" 
      leftSection={<IconArrowLeft size={16} />}
      onClick={() => router.back()}
      px={0}
      styles={{
        root: { color: 'var(--mantine-color-dimmed)' },
        section: { marginRight: 8 }
      }}
    >
      {label}
    </Button>
  )
}