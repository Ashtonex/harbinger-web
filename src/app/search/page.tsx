"use client";

import { useState } from "react";
import { 
  Container, TextInput, Title, Stack, Paper, Text, 
  Group, Badge, Loader, Highlight, ActionIcon, SegmentedControl 
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconBook, IconPray } from "@tabler/icons-react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useDebouncedCallback } from "@mantine/hooks";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ type: string; data: any }[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. The Search Logic (Debounced for performance)
  const handleSearch = useDebouncedCallback(async (term: string) => {
    if (term.length < 3) {
        setResults([]);
        return;
    }
    
    setLoading(true);

    // Search Bible (Standard Join, no RPC needed)
    const { data: verses } = await supabase
      .from("verses")
      .select("text, verse, chapter, books!inner(name)") // !inner ensures we get book name
      .textSearch("text", term)
      .limit(5);

    // Search Prayer Wall
    const { data: prayers } = await supabase
      .from("prayers")
      .select("content, id, created_at")
      .textSearch("content", term)
      .limit(3);

    // Combine Results
    const combined = [
      ...(verses?.map(v => ({ type: "Bible", data: v })) || []),
      ...(prayers?.map(p => ({ type: "Prayer", data: p })) || [])
    ];

    setResults(combined);
    setLoading(false);
  }, 500); // Wait 500ms after typing stops

  return (
    <Container size="md" py="xl">
      <Title ta="center" mb="lg">Search Harbinger</Title>

      {/* INPUT */}
      <TextInput
        size="lg"
        radius="xl"
        placeholder="Search for 'grace', 'healing', or a prayer..."
        leftSection={loading ? <Loader size="xs" /> : <IconSearch size={18} />}
        value={query}
        onChange={(e) => {
            setQuery(e.target.value);
            handleSearch(e.target.value);
        }}
        mb={40}
      />

      {/* RESULTS */}
      <Stack>
        {results.map((item, i) => (
          <Link 
            key={i} 
            // Dynamic Link: If Bible -> go to reader. If Prayer -> go to wall.
            href={
                item.type === 'Bible' 
                ? `/bible/${item.data.books.name}/${item.data.chapter}?focus=${item.data.verse}` 
                : '/prayers'
            }
            style={{ textDecoration: 'none' }}
          >
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                 <Badge 
                   variant="light" 
                   color={item.type === 'Bible' ? 'blue' : 'orange'}
                   leftSection={item.type === 'Bible' ? <IconBook size={12}/> : <IconPray size={12}/>}
                 >
                    {item.type === 'Bible' 
                      ? `${item.data.books.name} ${item.data.chapter}:${item.data.verse}` 
                      : `Prayer Request`}
                 </Badge>
                 <IconArrowRight size={14} color="gray" />
              </Group>

              <Text size="md" lh={1.6} component="div" c="dimmed">
                <Highlight highlight={query} highlightColor="yellow">
                   {item.type === 'Bible' ? item.data.text : item.data.content}
                </Highlight>
              </Text>
              
              {item.type === 'Prayer' && (
                  <Text size="xs" c="dimmed" mt="xs">
                    Posted on {new Date(item.data.created_at).toLocaleDateString()}
                  </Text>
              )}
            </Paper>
          </Link>
        ))}

        {query.length > 2 && results.length === 0 && !loading && (
            <Text c="dimmed" ta="center" fs="italic">No results found.</Text>
        )}
      </Stack>
    </Container>
  );
}