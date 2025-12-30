"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signOutAction() {
  // FIXED: Ensure client creation is awaited
  const supabase = await createClient()
  
  // 1. Clear the session on the server (Deleting the cookie)
  await supabase.auth.signOut()
  
  // 2. Clear the cache for the entire app (Layout, Navbar, etc.)
  // This ensures the "Log Out" button disappears immediately.
  revalidatePath('/', 'layout')

  // 3. Force the user to the login page
  redirect("/login")
}
