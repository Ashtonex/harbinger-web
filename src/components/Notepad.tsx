"use client";

import { useState, useEffect } from "react";
import { Drawer, Textarea, Button, Text, ActionIcon, Group } from "@mantine/core";
import { IconNotes, IconCheck } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthProvider";

export default function Notepad({ book, chapter }: { book: string, chapter: number }) {
  const { user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // HYDRATION FIX: Track if the component has mounted in the browser
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load note for this specific chapter when opened
  useEffect(() => {
    if (opened && user) {
        loadNote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, user]); // Removed dependency loop

  const loadNote = async () => {
    const ref = `${book} ${chapter}`;
    const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user?.id)
        .eq("reference", ref)
        .maybeSingle(); // <--- CHANGED FROM .single() TO .maybeSingle()
    
    if (data) {
        setNote(data.content);
        setNoteId(data.id);
    } else {
        setNote("");
        setNoteId(null);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const ref = `${book} ${chapter}`;

    const payload = {
        user_id: user.id,
        content: note,
        reference: ref
    };

    if (noteId) {
        await supabase.from("notes").update({ content: note }).eq("id", noteId);
    } else {
        const { data } = await supabase.from("notes").insert(payload).select().single();
        if (data) setNoteId(data.id);
    }
    setSaving(false);
  };

  // HYDRATION FIX: Return null if not mounted yet
  if (!mounted) return null;
  
  // AUTH CHECK: Don't show if no user
  if (!user) return null;

  return (
    <>
      {/* FLOATING BUTTON */}
      <ActionIcon 
        size={50} 
        radius="xl" 
        color="blue" 
        variant="filled" 
        style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
        onClick={open}
      >
        <IconNotes size={26} />
      </ActionIcon>

      {/* DRAWER */}
      <Drawer opened={opened} onClose={close} title="Sermon Notes" position="right">
         <Group mb="md" justify="space-between">
            <Text fw={700} c="dimmed">{book} {chapter}</Text>
            <Button 
                size="xs" 
                variant="light" 
                color="green" 
                loading={saving} 
                onClick={handleSave}
                leftSection={<IconCheck size={14}/>}
            >
                Save
            </Button>
         </Group>
         
         <Textarea
            placeholder="Write your revelation here..."
            autosize
            minRows={20}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleSave} 
         />
      </Drawer>
    </>
  );
}