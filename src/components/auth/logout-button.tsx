"use client"

import { createClient } from "@/utils/supabase/client"
import { Button } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()
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