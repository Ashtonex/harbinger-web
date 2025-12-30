"use client";

import { Container, Paper, Title, Text, Button, Center, Loader } from "@mantine/core";
import { IconCircleCheck, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// 1. Move the logic that uses 'useSearchParams' into a sub-component
function SuccessContent() {
  const searchParams = useSearchParams();
  // You can use this later if you want to show different messages based on status
  const status = searchParams.get("status");

  return (
    <Paper shadow="md" p="xl" radius="md" withBorder ta="center">
      <Center mb="md">
        <IconCircleCheck size={60} color="var(--mantine-color-green-6)" />
      </Center>

      <Title order={2} mb="sm">Payment Initiated!</Title>
      
      <Text c="dimmed" mb="xl">
        Thank you for your giving. If you completed the transaction on Paynow, 
        you will receive a confirmation email shortly.
      </Text>

      <Button component={Link} href="/give" leftSection={<IconArrowLeft size={16} />} variant="default">
        Return to Giving
      </Button>
    </Paper>
  );
}

// 2. Wrap the sub-component in Suspense in the main export
export default function SuccessPage() {
  return (
    <Container size="xs" py="xl">
      <Suspense 
        fallback={
          <Center py="xl">
            <Loader size="lg" />
          </Center>
        }
      >
        <SuccessContent />
      </Suspense>
    </Container>
  );
}