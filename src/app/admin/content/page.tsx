"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { Container, TextInput, Textarea, Button, Title, Paper, Alert, Divider, Grid } from "@mantine/core";
import { IconCheck, IconCalendarEvent, IconBook } from "@tabler/icons-react";

export default function ContentManager() {
  // --- VERSE OF THE DAY STATE ---
  const [ref, setRef] = useState("");
  const [text, setText] = useState("");
  const [thought, setThought] = useState("");
  const [verseSuccess, setVerseSuccess] = useState(false);

  // --- EVENTS STATE ---
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState(""); // ISO String from input
  const [eventLoc, setEventLoc] = useState("");
  const [eventSuccess, setEventSuccess] = useState(false);

  // 1. Save Verse of the Day
  const handleSaveVerse = async () => {
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from("daily_content").upsert({
      date: today,
      verse_ref: ref,
      verse_text: text,
      thought: thought
    }, { onConflict: 'date' });

    if (!error) {
      setVerseSuccess(true);
      setTimeout(() => setVerseSuccess(false), 3000);
    }
  };

  // 2. Create Event
  const handleCreateEvent = async () => {
    if (!eventTitle || !eventDate) return alert("Title and Date are required");
    
    // Create timestamp
    const timestamp = new Date(eventDate).toISOString();

    const { error } = await supabase.from("events").insert({
       title: eventTitle,
       description: eventDesc,
       date: timestamp,
       location: eventLoc
    });
    
    if (!error) {
        setEventSuccess(true);
        setEventTitle("");
        setEventDesc("");
        setEventLoc("");
        setTimeout(() => setEventSuccess(false), 3000);
    } else {
        alert("Error creating event: " + error.message);
    }
 };

  return (
    <Container size="md" py="xl">
      <Title ta="center" mb={40}>Content Management System</Title>
      
      <Grid gutter={40}>
        
        {/* --- LEFT COLUMN: VERSE OF THE DAY --- */}
        <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3} mb="md" c="blue">
                <IconBook size={24} style={{ marginBottom: -5, marginRight: 8 }}/>
                Verse of the Day
            </Title>
            
            {verseSuccess && <Alert color="green" icon={<IconCheck/>} mb="md">Updated Verse!</Alert>}

            <Paper p="lg" withBorder radius="md" shadow="sm">
                <TextInput 
                label="Verse Reference" 
                placeholder="e.g. John 3:16" 
                mb="md"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                />
                
                <Textarea 
                label="Verse Text" 
                placeholder="For God so loved..." 
                minRows={3} 
                mb="md"
                value={text}
                onChange={(e) => setText(e.target.value)}
                />
                
                <Textarea 
                label="Pastor's Thought" 
                placeholder="This verse reminds us..." 
                minRows={4} 
                mb="xl"
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                />

                <Button fullWidth onClick={handleSaveVerse}>Publish to Homepage</Button>
            </Paper>
        </Grid.Col>

        {/* --- RIGHT COLUMN: EVENT CREATOR --- */}
        <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={3} mb="md" c="orange">
                <IconCalendarEvent size={24} style={{ marginBottom: -5, marginRight: 8 }}/>
                Create Event
            </Title>

            {eventSuccess && <Alert color="green" icon={<IconCheck/>} mb="md">Event Created!</Alert>}

            <Paper p="lg" withBorder radius="md" shadow="sm">
                <TextInput 
                    label="Event Title" 
                    placeholder="Worship Night" 
                    value={eventTitle} 
                    onChange={e => setEventTitle(e.target.value)} 
                    mb="md" 
                />
                
                <TextInput 
                    label="Location" 
                    placeholder="Main Sanctuary / Online" 
                    value={eventLoc} 
                    onChange={e => setEventLoc(e.target.value)} 
                    mb="md" 
                />

                {/* Native HTML Date Picker is safer without extra libs */}
                <TextInput 
                    type="datetime-local" 
                    label="Date & Time" 
                    mb="md" 
                    onChange={(e) => setEventDate(e.target.value)}
                />

                <Textarea 
                    label="Description" 
                    placeholder="Join us for a night of praise..." 
                    value={eventDesc} 
                    onChange={e => setEventDesc(e.target.value)} 
                    minRows={3}
                    mb="xl" 
                />

                <Button fullWidth color="orange" onClick={handleCreateEvent}>Publish Event</Button>
            </Paper>
        </Grid.Col>

      </Grid>
    </Container>
  );
}