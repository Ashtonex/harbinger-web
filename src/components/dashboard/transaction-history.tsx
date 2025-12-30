"use client";

import { useEffect, useState } from "react";
import { Table, Badge, Loader, Center, Text, Paper } from "@mantine/core";
import { supabase } from "@/utils/supabase"; 

interface Transaction {
  id: string;
  created_at: string;
  category: string;
  amount: number;
  status: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) setTransactions(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  if (loading) return <Center p="xl"><Loader size="sm" /></Center>;

  if (transactions.length === 0) {
    return (
      <Paper p="xl" withBorder style={{ borderStyle: 'dashed', textAlign: 'center' }}>
        <Text size="sm" c="dimmed">No recent transactions found.</Text>
      </Paper>
    );
  }

  return (
    <Table verticalSpacing="sm" highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th style={{ textAlign: 'right' }}>Amount</Table.Th>
          <Table.Th style={{ textAlign: 'center' }}>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {transactions.map((txn) => (
          <Table.Tr key={txn.id}>
            <Table.Td>
              <Text size="sm">{new Date(txn.created_at).toLocaleDateString()}</Text>
            </Table.Td>
            <Table.Td>
               <Text size="sm" tt="capitalize">{txn.category || 'Contribution'}</Text>
            </Table.Td>
            <Table.Td style={{ textAlign: 'right' }}>
               <Text size="sm" fw={500}>${txn.amount.toFixed(2)}</Text>
            </Table.Td>
            <Table.Td style={{ textAlign: 'center' }}>
              <Badge 
                color={txn.status === 'success' ? 'green' : 'yellow'} 
                variant="light"
              >
                {txn.status}
              </Badge>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}