"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Anchor,
  Stack,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";

export default function AuthenticationTitle() {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Only for registration
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/"); // Redirect to home on success
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name, // This saves to user_metadata
            },
          },
        });
        if (error) throw error;
        alert("Account created! You can now log in.");
        setType("login");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" fw={900}>
        Welcome back to Harbinger
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button" onClick={() => setType(type === "login" ? "register" : "login")}>
          {type === "login" ? "Create account" : "Login"}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
          {type === "register" && (
            <TextInput 
              label="Full Name" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required 
            />
          )}
          
          <TextInput 
            label="Email" 
            placeholder="you@harbinger.com" 
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required 
          />
          
          <PasswordInput 
            label="Password" 
            placeholder="Your password" 
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required 
            mt="md" 
          />
        </Stack>

        <Button fullWidth mt="xl" onClick={handleSubmit} loading={loading}>
          {type === "login" ? "Sign in" : "Register"}
        </Button>
      </Paper>
    </Container>
  );
}