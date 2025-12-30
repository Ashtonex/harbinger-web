"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function signOutAction() {
  const supabase = await createClient()
  
  // 1. Clear the session on the server (Deleting the cookie)
  await supabase.auth.signOut()
  
  // 2. Force the user to the login page
  redirect("/login")
}