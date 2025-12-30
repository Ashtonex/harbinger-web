"use client";

import { Container, Paper, Title, Text, Button, Center } from "@mantine/core";
import { IconCircleCheck, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  // Paynow adds ?status=Paid or ?status=Cancelled to the URL
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <Container size="xs" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder ta="center">
        <Center mb="md">
          <IconCircleCheck size={60} color="green" />
        </Center>

        <Title order={2} mb="sm">Payment Initiated!</Title>
        
        <Text c="dimmed" mb="xl">
          Thank you for your giving. If you completed the transaction on Paynow, 
          you will receive a confirmation email shortly.
        </Text>

        <Link href="/give">
          <Button leftSection={<IconArrowLeft size={16} />} variant="default">
            Return to Giving
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}