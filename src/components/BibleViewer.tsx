"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Paper, Text, Group, Button, ActionIcon, Tooltip, 
  Modal, Select, Badge, Box, Switch 
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconVolume, IconShare, IconDownload, IconArrowRight, IconArrowLeft, IconBroadcast } from "@tabler/icons-react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { supabase } from "@/utils/supabase";

type Verse = {
  verse: number;
  text: string;
};

export default function BibleViewer({ 
  book, 
  chapter, 
  verses, 
  allBooks 
}: { 
  book: string; 
  chapter: number; 
  verses: Verse[]; 
  allBooks: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams(); // To read the URL ?focus=16
  
  const [highlightedVerses, setHighlightedVerses] = useState<number[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  const [shareModalOpen, { open: openShare, close: closeShare }] = useDisclosure(false);
  const shareRef = useRef<HTMLDivElement>(null); 

  // --- 1. NEW: AUTO-SCROLL & HIGHLIGHT ON LOAD ---
  useEffect(() => {
    // Check if the URL has a focus param (e.g. ?focus=16)
    const focusVerse = searchParams.get('focus');
    
    if (focusVerse) {
      const verseNum = parseInt(focusVerse);
      
      // 1. Highlight it visually
      setHighlightedVerses([verseNum]);

      // 2. Scroll to it smoothly
      const element = document.getElementById(`verse-${verseNum}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchParams, verses]); // Run whenever URL changes or new verses load


  // --- 2. UPDATED LIVE LISTENER ---
  useEffect(() => {
    if (!isLiveMode) return;

    console.log("📡 Connecting to Live Service...");
    const channel = supabase.channel('live-service');

    channel
      .on(
        'broadcast', 
        { event: 'pulpit_verse' }, 
        (payload) => {
          console.log("⚡ Signal Received:", payload);
          const { book: newBook, chapter: newChapter, verse } = payload.payload;
          
          // Force Navigation with the ?focus parameter
          router.push(`/bible/${newBook}/${newChapter}?focus=${verse}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLiveMode, router]);


  // Standard Handlers
  const handleChapterChange = (val: string | null) => {
    if (val) router.push(`/bible/${book}/${val}`);
  };

  const handleBookChange = (val: string | null) => {
    if (val) router.push(`/bible/${val}/1`);
  };

  const toggleHighlight = (verseNum: number) => {
    if (highlightedVerses.includes(verseNum)) {
      setHighlightedVerses(prev => prev.filter(v => v !== verseNum));
    } else {
      setHighlightedVerses(prev => [...prev, verseNum]);
    }
  };

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const fullText = verses.map(v => `${v.verse}. ${v.text}`).join(" ");
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech not supported in this browser.");
    }
  };

  const downloadImage = async () => {
    if (shareRef.current === null) return;
    const dataUrl = await toPng(shareRef.current, { cacheBust: true });
    saveAs(dataUrl, `harbinger-${book}-${chapter}.png`);
    closeShare();
  };

  return (
    <Box>
      <Group justify="space-between" mb="lg" align="center">
        <Group gap="xs">
           <Select 
            searchable
            data={allBooks.map(b => b.name)}
            value={book}
            onChange={handleBookChange}
            w={160}
          />
           <Select 
            data={Array.from({length: 50}, (_, i) => (i + 1).toString())} 
            value={chapter.toString()}
            onChange={handleChapterChange}
            w={80}
          />
        </Group>

        <Group>
          <Switch 
            size="md"
            color="red"
            onLabel={<IconBroadcast size={14} />}
            offLabel="OFF"
            labelPosition="left"
            label={isLiveMode ? "LIVE SERVICE" : "Join Live"}
            checked={isLiveMode}
            onChange={(event) => setIsLiveMode(event.currentTarget.checked)}
          />
          <Tooltip label="Listen">
            <ActionIcon variant="light" size="lg" radius="xl" onClick={playAudio}>
              <IconVolume size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Share">
            <ActionIcon 
              variant="filled" color="blue" size="lg" radius="xl" 
              onClick={openShare} 
              disabled={highlightedVerses.length === 0}
            >
              <IconShare size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Paper shadow="sm" p="xl" radius="md" withBorder>
        {verses.map((v) => {
          const isHighlighted = highlightedVerses.includes(v.verse);
          return (
            <Text 
              key={v.verse}
              // --- 3. IMPORTANT: ID ADDED HERE FOR SCROLLING ---
              id={`verse-${v.verse}`}
              // ------------------------------------------------
              lh={1.8} 
              size="lg" 
              mb="xs"
              style={{ 
                backgroundColor: isHighlighted ? '#fff3bf' : 'transparent',
                transition: 'background-color 0.5s ease', // Smooth fade in
                cursor: 'pointer',
                borderRadius: '4px',
                padding: '4px 6px'
              }}
              onClick={() => toggleHighlight(v.verse)}
            >
              <Text span c="dimmed" size="xs" fw={700} mr="xs" style={{ userSelect: 'none' }}>
                {v.verse}
              </Text>
              {v.text}
            </Text>
          );
        })}
      </Paper>

      {/* Nav Buttons & Modal (Same as before) */}
      <Group justify="center" mt="xl">
        <Button 
          variant="default" 
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.push(`/bible/${book}/${chapter - 1}`)}
          disabled={chapter <= 1}
        >
          Previous
        </Button>
        <Button 
          rightSection={<IconArrowRight size={16} />}
          onClick={() => router.push(`/bible/${book}/${chapter + 1}`)}
        >
          Next
        </Button>
      </Group>

      <Modal opened={shareModalOpen} onClose={closeShare} title="Share to Socials" centered>
        <div ref={shareRef} style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          padding: '40px', 
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
           <Text size="xl" fw={900} mb="lg">HARBINGER</Text>
           {verses.filter(v => highlightedVerses.includes(v.verse)).map(v => (
             <Text key={v.verse} size="lg" fs="italic" mb="sm">"{v.text}"</Text>
           ))}
           <Badge color="white" variant="light" mt="xl" size="lg">{book} {chapter}</Badge>
        </div>
        <Button fullWidth mt="md" leftSection={<IconDownload size={16}/>} onClick={downloadImage}>
          Download Image
        </Button>
      </Modal>
    </Box>
  );
}