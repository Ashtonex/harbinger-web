import { supabase } from "@/utils/supabase";
import { Container, Title, Button, Group, Text } from "@mantine/core";
import BibleViewer from "@/components/BibleViewer";
import Notepad from "@/components/Notepad"; // <--- 1. Import Notepad
import Link from "next/link";

// OPTIONAL: Cache this page for 1 hour for performance
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export default async function BiblePage({ params }: PageProps) {
  // 1. Unwrap params (Next.js 15 requirement)
  const { book: rawBook, chapter } = await params;
  
  const bookName = decodeURIComponent(rawBook);
  const chapterNum = parseInt(chapter);

  console.log(`🔍 Searching for book: "${bookName}" (Chapter: ${chapterNum})`);

  // 2. Get Book ID (Using ilike for case-insensitivity)
  const { data: bookData, error } = await supabase
    .from("books")
    .select("id, name")
    .ilike("name", bookName)
    .single();

  if (error || !bookData) {
    console.error("❌ Book lookup failed:", error);
    return (
      <Container py="xl" ta="center">
        <Title order={3}>Book "{bookName}" not found.</Title>
        <Text c="dimmed" mb="md">Check the spelling or go back to the library.</Text>
        <Group justify="center" mt="md">
            <Link href="/bible"><Button>Return to Library</Button></Link>
        </Group>
      </Container>
    );
  }

  // 3. Get Verses
  const { data: verses } = await supabase
    .from("verses")
    .select("verse, text")
    .eq("book_id", bookData.id)
    .eq("chapter", chapterNum)
    .order("verse", { ascending: true });

  // 4. Get All Books (for navigation)
  const { data: allBooks } = await supabase
    .from("books")
    .select("name")
    .order("order_index", { ascending: true });

  return (
    <Container size="md" py="xl">
      <BibleViewer 
        book={bookData.name} 
        chapter={chapterNum} 
        verses={verses || []} 
        allBooks={allBooks || []}
      />

      {/* 5. ADD NOTEPAD COMPONENT HERE */}
      <Notepad book={bookData.name} chapter={chapterNum} />
      
    </Container>
  );
}