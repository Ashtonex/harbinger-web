import { createClient } from '@supabase/supabase-js'

// Use fallbacks so the build doesn't crash if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwsstkpnrwrcznufdsxv.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_wl5h9pT8LGItnVIN7RlxZQ_YUJQcOJh'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13c3N0a3BucndyY3pudWZkc3h2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjU3NDQyOCwiZXhwIjoyMDgyMTUwNDI4fQ.om5uYWHe8X887utF_73sfwm777PTLxNHRcv0zgrBk9k'

// Standard Client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin Client (if you export it from here)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)