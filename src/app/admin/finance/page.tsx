"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Container, Grid, Paper, Text, Group, Button, Title, Table, RingProgress } from "@mantine/core";
import { IconDownload, IconCoin } from "@tabler/icons-react";

export default function FinancialReports() {
  const [stats, setStats] = useState({ total: 0, tithe: 0, offering: 0, count: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("status", "Paid") // Only count real money
      .order("created_at", { ascending: false });

    if (data) {
      setTransactions(data);
      // Calculate Totals
      const total = data.reduce((sum, t) => sum + Number(t.amount), 0);
      const tithe = data.filter(t => t.category === 'Tithe').reduce((sum, t) => sum + Number(t.amount), 0);
      const offering = data.filter(t => t.category === 'Offering').reduce((sum, t) => sum + Number(t.amount), 0);
      
      setStats({ total, tithe, offering, count: data.length });
    }
  };

  // CSV EXPORT FUNCTION
  const downloadCSV = () => {
    const headers = ["Date,Email,Category,Amount,Reference"];
    const rows = transactions.map(t => 
      `${new Date(t.created_at).toLocaleDateString()},${t.email},${t.category},${t.amount},${t.reference}`
    );
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Treasury Overview</Title>
        <Button leftSection={<IconDownload size={16} />} color="green" onClick={downloadCSV}>
          Export CSV
        </Button>
      </Group>

      {/* STAT CARDS */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md" radius="md">
            <Text c="dimmed" tt="uppercase" fw={700} size="xs">Total Revenue</Text>
            <Text fw={700} size="xl" c="green">${stats.total.toFixed(2)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 4 }}>
          <Paper withBorder p="md" radius="md">
             <Text c="dimmed" tt="uppercase" fw={700} size="xs">Tithes</Text>
             <Text fw={700} size="lg">${stats.tithe.toFixed(2)}</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 6, md: 4 }}>
          <Paper withBorder p="md" radius="md">
             <Text c="dimmed" tt="uppercase" fw={700} size="xs">Offerings</Text>
             <Text fw={700} size="lg">${stats.offering.toFixed(2)}</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* RECENT TRANSACTIONS TABLE */}
      <Paper withBorder radius="md">
        <Table striped p="md">
          <Table.Thead>
            <Table.Tr><Table.Th>Date</Table.Th><Table.Th>Email</Table.Th><Table.Th>Category</Table.Th><Table.Th>Amount</Table.Th></Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {transactions.slice(0, 10).map((t) => ( // Show only last 10
              <Table.Tr key={t.id}>
                <Table.Td>{new Date(t.created_at).toLocaleDateString()}</Table.Td>
                <Table.Td>{t.email}</Table.Td>
                <Table.Td>{t.category}</Table.Td>
                <Table.Td fw={700}>${t.amount}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}