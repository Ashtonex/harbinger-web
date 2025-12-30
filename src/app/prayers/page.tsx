"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { 
  Container, Title, Textarea, Button, Paper, Group, 
  Text, Switch, Stack, Badge, ActionIcon, Divider, Menu, TextInput
} from "@mantine/core";
import { 
  IconPray, IconHandStop, IconLock, IconWorld, 
  IconDotsVertical, IconTrash, IconEdit, IconCheck, IconX 
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthProvider";

interface Prayer {
  id: string;
  user_id: string; // Needed to check ownership
  content: string;
  is_public: boolean;
  created_at: string;
  amens_count?: number;
  user_has_amened?: boolean;
}

export default function PrayerWall() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);

  // EDITING STATE
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // 1. Fetch Data
  const fetchPrayers = async () => {
    setLoading(true);
    const { data: prayerData } = await supabase
      .from("prayers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!prayerData) return;

    const { data: amenData } = await supabase.from("amens").select("prayer_id, user_id");
    
    const processed = prayerData.map(p => {
      const pAmens = amenData?.filter(a => a.prayer_id === p.id) || [];
      return {
        ...p,
        amens_count: pAmens.length,
        user_has_amened: user ? pAmens.some(a => a.user_id === user.id) : false
      };
    });

    setPrayers(processed);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrayers();
    const channel = supabase
      .channel('prayer-wall')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prayers' }, fetchPrayers)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'amens' }, fetchPrayers)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // 2. CREATE
  const handleSubmit = async () => {
    if (!newPrayer.trim() || !user) return;
    await supabase.from("prayers").insert({
      user_id: user.id,
      content: newPrayer,
      is_public: isPublic
    });
    setNewPrayer("");
  };

  // 3. DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prayer?")) return;
    await supabase.from("prayers").delete().eq("id", id);
  };

  // 4. UPDATE (Start Edit Mode)
  const startEdit = (prayer: Prayer) => {
    setEditingId(prayer.id);
    setEditText(prayer.content);
  };

  // 5. UPDATE (Save Changes)
  const saveEdit = async (id: string) => {
    await supabase.from("prayers").update({ content: editText }).eq("id", id);
    setEditingId(null);
  };

  // 6. TOGGLE AMEN
  const handleAmen = async (prayerId: string) => {
    if (!user) return alert("Please sign in to say Amen.");
    // Optimistic Update
    setPrayers(current => 
      current.map(p => {
        if (p.id === prayerId) {
            const wasAmened = p.user_has_amened;
            return {
                ...p,
                user_has_amened: !wasAmened,
                amens_count: (p.amens_count || 0) + (wasAmened ? -1 : 1)
            };
        }
        return p;
      })
    );
    await supabase.rpc("toggle_amen", { p_id: prayerId });
  };

  return (
    <Container size="sm" py="xl">
      <Title ta="center" mb="lg">Prayer Wall</Title>

      {/* CREATE FORM */}
      {user ? (
        <Paper withBorder p="md" radius="md" mb="xl" shadow="sm">
          <Textarea 
            placeholder="Share your prayer request..." 
            label="Post a Prayer"
            minRows={3}
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            mb="sm"
          />
          <Group justify="space-between">
            <Switch 
              label={isPublic ? "Public Wall" : "Pastor Only (Private)"}
              checked={isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.checked)}
              color={isPublic ? "blue" : "orange"}
              onLabel={<IconWorld size={14} />}
              offLabel={<IconLock size={14} />}
            />
            <Button onClick={handleSubmit} disabled={!newPrayer.trim()}>Post Prayer</Button>
          </Group>
        </Paper>
      ) : (
        <Paper withBorder p="md" radius="md" mb="xl" bg="gray.1" ta="center">
           <Text>Please <a href="/login">Log In</a> to post prayers.</Text>
        </Paper>
      )}

      <Divider mb="xl" label="Recent Prayers" labelPosition="center" />

      {/* PRAYER LIST */}
      <Stack>
        {prayers.map((prayer) => (
          <Paper key={prayer.id} shadow="xs" p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs" align="flex-start">
                <Group>
                    <Badge color={prayer.is_public ? "blue" : "orange"} variant="light">
                        {prayer.is_public ? "Public" : "Private"}
                    </Badge>
                    <Text size="xs" c="dimmed">
                        {new Date(prayer.created_at).toLocaleDateString()}
                    </Text>
                </Group>

                {/* EDIT/DELETE MENU (Only if you own the prayer) */}
                {user && user.id === prayer.user_id && (
                  <Menu position="bottom-end" shadow="md">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={16}/></ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEdit size={14}/>} onClick={() => startEdit(prayer)}>
                        Edit Prayer
                      </Menu.Item>
                      <Menu.Item leftSection={<IconTrash size={14}/>} color="red" onClick={() => handleDelete(prayer.id)}>
                        Delete Prayer
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                )}
            </Group>
            
            {/* CONTENT AREA (View Mode vs Edit Mode) */}
            {editingId === prayer.id ? (
                <Group align="flex-start" mb="md">
                    <Textarea 
                        value={editText} 
                        onChange={(e) => setEditText(e.target.value)} 
                        style={{ flex: 1 }}
                        autosize
                        minRows={2}
                    />
                    <ActionIcon color="green" variant="filled" onClick={() => saveEdit(prayer.id)}>
                        <IconCheck size={16} />
                    </ActionIcon>
                    <ActionIcon color="red" variant="subtle" onClick={() => setEditingId(null)}>
                        <IconX size={16} />
                    </ActionIcon>
                </Group>
            ) : (
                <Text size="lg" mb="md" style={{ whiteSpace: 'pre-wrap' }}>
                    {prayer.content}
                </Text>
            )}

            <Divider my="sm" />
            
            <Group>
              <Button 
                variant={prayer.user_has_amened ? "filled" : "light"}
                color="teal"
                radius="xl"
                size="sm"
                leftSection={<IconHandStop size={16} />}
                onClick={() => handleAmen(prayer.id)}
              >
                Amen {prayer.amens_count && prayer.amens_count > 0 ? `(${prayer.amens_count})` : ""}
              </Button>
            </Group>
          </Paper>
        ))}
        
        {prayers.length === 0 && !loading && (
            <Text c="dimmed" ta="center" fs="italic">No prayers yet.</Text>
        )}
      </Stack>
    </Container>
  );
}