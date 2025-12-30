import { createClient } from '@supabase/supabase-js'

// Use fallbacks so the build doesn't crash if env vars are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Standard Client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin Client (if you export it from here)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)