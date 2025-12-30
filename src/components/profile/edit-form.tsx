"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// FIXED: Import 'supabase' directly
import { supabase } from "@/utils/supabase/client"
import { 
  Title, TextInput, Button, Group, Stack, Paper, Select, 
  Textarea, SimpleGrid, Avatar, FileButton, Text, Loader, Center 
} from "@mantine/core"
import { IconDeviceFloppy, IconUpload } from "@tabler/icons-react"
// Note: If BackButton doesn't exist, you can replace it with a simple Link Button
import { BackButton } from "@/components/ui/back-button"

// Accept user and data as props (passed from the server)
export function EditForm({ user, initialData }: { user: any, initialData: any }) {
  // REMOVED: const supabase = createClient() -> We use the imported instance
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Load initial data immediately
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    gender: initialData?.gender || "",
    marital_status: initialData?.marital_status || "",
    birthday: initialData?.birthday || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    bio: initialData?.bio || "",
    avatar_url: initialData?.avatar_url || ""
  })

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image!");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true)
    const updates = {
      id: user.id,
      ...formData,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("profiles").upsert(updates)
    if (!error) {
      router.push("/profile") 
      router.refresh()
    } else {
      alert("Error saving data")
    }
    setSaving(false)
  }

  return (
    <Stack gap="lg">
      <BackButton label="Cancel & Go Back" />
      <Title order={2}>Edit Your Profile</Title>
      
      <Paper withBorder p="xl" radius="md">
        <Stack gap="lg">
          
          {/* Identity Section */}
          <Title order={4} c="dimmed">Identity</Title>
          <Group align="flex-start">
              <Avatar src={formData.avatar_url} size={80} radius={80} color="blue">
                {formData.first_name?.[0]}
              </Avatar>
              <Stack gap="xs">
                <Text size="sm" fw={500}>Profile Photo</Text>
                <FileButton onChange={handleUpload} accept="image/png,image/jpeg">
                  {(props) => (
                    <Button {...props} size="xs" variant="default" loading={uploading} leftSection={<IconUpload size={14} />}>
                      {uploading ? "Uploading..." : "Upload New"}
                    </Button>
                  )}
                </FileButton>
              </Stack>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="First Name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} />
              <TextInput label="Last Name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} />
              <Select label="Gender" data={['Male', 'Female']} value={formData.gender} onChange={(val) => setFormData({...formData, gender: val || ""})} />
              <Select label="Marital Status" data={['Single', 'Married', 'Engaged', 'Widowed', 'Divorced']} value={formData.marital_status} onChange={(val) => setFormData({...formData, marital_status: val || ""})} />
              <TextInput type="date" label="Date of Birth" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
          </SimpleGrid>

          {/* Contact Section */}
          <Title order={4} c="dimmed" mt="md">Contact & Location</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <TextInput label="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
          </SimpleGrid>
          <TextInput label="Street Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />

          {/* Bio Section */}
          <Title order={4} c="dimmed" mt="md">About You</Title>
          <Textarea label="Bio" minRows={4} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />

          <Button size="md" leftSection={<IconDeviceFloppy size={20} />} onClick={handleSave} loading={saving} fullWidth>
            Save Changes
          </Button>

        </Stack>
      </Paper>
    </Stack>
  )
}