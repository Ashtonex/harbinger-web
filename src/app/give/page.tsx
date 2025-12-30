"use client";

import { useState } from "react";
import { 
  Container, Paper, Title, TextInput, NumberInput, 
  Select, Button, Text, Group, LoadingOverlay, Alert 
} from "@mantine/core";
import { IconHeartHandshake, IconCurrencyDollar, IconCreditCard } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthProvider";

export default function GivePage() {
  const { user } = useAuth();
  
  // Form State
  const [amount, setAmount] = useState<string | number>(10);
  const [category, setCategory] = useState<string | null>("Tithe");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!amount || !category || !email) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      // Call our internal secure API
      const res = await fetch("/api/paynow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount, category }),
      });

      const data = await res.json();

      if (data.success && data.url) {
        // Redirect user to Paynow (Ecocash/Visa page)
        window.location.href = data.url;
      } else {
        setError("Failed to initiate payment. Check your connection.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      // We don't stop loading because we are redirecting...
      // but if error, we stop.
      if (error) setLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Title ta="center" mb="md" order={2}>
             <IconHeartHandshake size={32} style={{ marginBottom: -5, marginRight: 8 }} />
             Give Online
        </Title>
        
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          "God loves a cheerful giver." — 2 Corinthians 9:7
        </Text>

        {error && <Alert color="red" mb="md">{error}</Alert>}

        <TextInput
          label="Email Address"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb="md"
          required
        />

        <Select
          label="Category"
          data={["Tithe", "Offering", "Building Fund", "Thanksgiving"]}
          value={category}
          onChange={setCategory}
          mb="md"
          required
        />

        <NumberInput
          label="Amount (USD)"
          leftSection={<IconCurrencyDollar size={16} />}
          placeholder="10.00"
          value={amount}
          onChange={setAmount}
          min={1}
          mb="xl"
          required
        />

        <Button 
          fullWidth 
          size="lg" 
          color="green" 
          leftSection={<IconCreditCard size={20} />}
          onClick={handlePayment}
        >
          Proceed to Paynow
        </Button>
        
        <Group justify="center" mt="md">
            <Text size="xs" c="dimmed">Secured by Paynow (Ecocash / Visa / MasterCard)</Text>
        </Group>
      </Paper>
    </Container>
  );
}