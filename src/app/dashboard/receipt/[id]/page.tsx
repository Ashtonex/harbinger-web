"use client";

import { useEffect, useState } from "react";
import { Container, Paper, Title, Text, Group, Divider, Button, Stack, Center } from "@mantine/core";
import { IconPrinter, IconCheck } from "@tabler/icons-react";
import { supabase } from "@/utils/supabase";
import { useParams } from "next/navigation";

export default function ReceiptPage() {
  const { id } = useParams(); // Get ID from URL
  const [txn, setTxn] = useState<any>(null);

  useEffect(() => {
    const fetchTxn = async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();
      setTxn(data);
    };
    if (id) fetchTxn();
  }, [id]);

  if (!txn) return <Text p="xl" ta="center">Loading Receipt...</Text>;

  return (
    <Container size="sm" py="xl">
      <Paper 
        shadow="md" 
        p={40} 
        radius="md" 
        withBorder 
        bg="white"
        style={{ borderTop: '5px solid #2f9e44' }} // Green top border
      >
        {/* HEADER */}
        <Group justify="space-between" mb="lg">
            <Title order={3}>OFFICIAL RECEIPT</Title>
            <Title order={4} c="dimmed">HARBINGER</Title>
        </Group>

        <Divider mb="xl" />

        {/* DETAILS */}
        <Stack gap="xs" mb="xl">
            <Group justify="space-between">
                <Text c="dimmed">Date:</Text>
                <Text fw={500}>{new Date(txn.created_at).toLocaleString()}</Text>
            </Group>
            <Group justify="space-between">
                <Text c="dimmed">Reference:</Text>
                <Text style={{ fontFamily: 'monospace' }}>{txn.reference}</Text>
            </Group>
             <Group justify="space-between">
                <Text c="dimmed">Paynow Ref:</Text>
                <Text style={{ fontFamily: 'monospace' }}>{txn.paynow_ref || "N/A"}</Text>
            </Group>
             <Group justify="space-between">
                <Text c="dimmed">Email:</Text>
                <Text>{txn.email}</Text>
            </Group>
        </Stack>

        <Paper bg="green.0" p="md" radius="sm" mb="xl">
             <Group justify="space-between">
                <Text size="lg" fw={700} c="green.9">{txn.category}</Text>
                <Text size="xl" fw={900} c="green.9">${Number(txn.amount).toFixed(2)}</Text>
            </Group>
        </Paper>

        <Center mb="xl">
            <Group gap={5}>
                <IconCheck size={18} color="green" />
                <Text c="green" fw={700} tt="uppercase">Payment Successful</Text>
            </Group>
        </Center>

        <Divider mb="xl" />

        {/* FOOTER ACTIONS */}
        <Button 
            fullWidth 
            variant="outline" 
            leftSection={<IconPrinter size={18} />}
            onClick={() => window.print()}
        >
            Print / Save as PDF
        </Button>
      </Paper>
    </Container>
  );
}