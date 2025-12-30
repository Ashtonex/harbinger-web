"use client"

import { supabase } from "@/utils/supabase/client" // Import the instance directly
import { Button } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  // Removed: const supabase = createClient() -- we use the imported instance
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Button 
      color="red" 
      variant="light" 
      leftSection={<IconLogout size={16} />} 
      onClick={handleLogout}
      loading={loading}
    >
      Log Out
    </Button>
  )
}