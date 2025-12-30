"use client"

import { useEffect, useState } from "react"
import { Paper, Text, Group, Stack, ThemeIcon, Center, Loader } from "@mantine/core"
import { IconCalendarEvent, IconClock } from "@tabler/icons-react" // Or use lucide-react if tabler isn't installed

interface Event {
  id: string
  name: string
  start_time: string
  end_time?: string
  location?: string
}

export function EventCountdown({ event }: { event: Event }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(event.start_time) - +new Date()
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [event.start_time])

  // Simple formatting helper to add leading zeros (e.g., "05" instead of "5")
  const formatTime = (num: number) => num.toString().padStart(2, '0')

  if (!timeLeft) {
    return (
      <Paper p="lg" radius="md" withBorder>
         <Center>
            <Loader size="sm" variant="dots" />
         </Center>
      </Paper>
    )
  }

  return (
    <Paper p="lg" radius="md" withBorder shadow="sm" bg="var(--mantine-color-body)">
      {/* Header Section */}
      <Group justify="space-between" align="start" mb="md">
        <div>
           <Text size="xs" fw={700} tt="uppercase" c="blue">
             Next Service
           </Text>
           <Text fw={700} size="lg" style={{ lineHeight: 1.2 }}>
             {event.name}
           </Text>
           <Text size="sm" c="dimmed" mt={4}>
             {new Date(event.start_time).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
             })}
           </Text>
        </div>
        <ThemeIcon size="lg" radius="md" variant="light" color="blue">
           <IconCalendarEvent size={20} />
        </ThemeIcon>
      </Group>

      {/* Countdown Timer Grid */}
      <Group grow align="center" gap="xs">
         <TimeBox value={formatTime(timeLeft.days)} label="Days" />
         <TimeBox value={":"} label="" isSeparator />
         <TimeBox value={formatTime(timeLeft.hours)} label="Hrs" />
         <TimeBox value={":"} label="" isSeparator />
         <TimeBox value={formatTime(timeLeft.minutes)} label="Mins" />
         <TimeBox value={":"} label="" isSeparator />
         <TimeBox value={formatTime(timeLeft.seconds)} label="Secs" />
      </Group>
    </Paper>
  )
}

// Helper Component for the little time boxes
function TimeBox({ value, label, isSeparator = false }: { value: string | number, label: string, isSeparator?: boolean }) {
   if (isSeparator) {
      return (
         <Stack align="center" justify="center" h="100%">
            <Text fw={700} size="lg" c="dimmed" mb="lg">:</Text>
         </Stack>
      )
   }

   return (
      <Paper 
        withBorder 
        p="xs" 
        radius="md" 
        bg="var(--mantine-color-gray-0)" 
        style={{ textAlign: 'center' }}
      >
         <Text fw={800} size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 45 }}>
            {value}
         </Text>
         <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {label}
         </Text>
      </Paper>
   )
}