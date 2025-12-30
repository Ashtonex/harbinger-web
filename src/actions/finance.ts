'use server'
import { createClient } from "@/utils/supabase/server"

export async function getTaxReportData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Fetch all successful transactions for the current year
  const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString()
  
  const { data } = await supabase
    .from('transactions') // Assuming you have this table from Phase 6
    .select('created_at, amount, currency, type, status, id')
    .eq('user_id', user.id)
    .eq('status', 'success')
    .gte('created_at', startOfYear)
    .order('created_at', { ascending: false })

  return data || []
}
