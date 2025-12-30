"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Paper, Text, Center, useMantineTheme } from "@mantine/core"

export function ActivityChart({ data }: { data: any[] }) {
  const theme = useMantineTheme();

  // 1. Empty State: Styled with Mantine components instead of Tailwind classes
  if (!data || data.length === 0) {
    return (
      <Paper h={300} withBorder style={{ borderStyle: 'dashed', backgroundColor: 'transparent' }}>
        <Center h="100%">
           <Text c="dimmed" size="sm">No activity recorded this week.</Text>
        </Center>
      </Paper>
    )
  }

  // 2. Chart State: Returns a responsive chart that fills the parent container
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={theme.colors.gray[3]} // Use Mantine gray for grid lines
            opacity={0.5} 
          />
          <XAxis 
            dataKey="name" 
            stroke={theme.colors.gray[5]} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis
            stroke={theme.colors.gray[5]}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              borderRadius: theme.radius.md, 
              border: `1px solid ${theme.colors.gray[2]}`, 
              boxShadow: theme.shadows.sm,
              fontSize: '14px'
            }}
          />
          <Bar 
            dataKey="total" 
            // DYNAMIC COLOR: Uses your active Mantine primary color (e.g., Blue, Grape, etc.)
            fill={theme.colors[theme.primaryColor][6]} 
            radius={[4, 4, 0, 0]} 
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}