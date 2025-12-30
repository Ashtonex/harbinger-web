'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBookmark(collectionId: string, resourceId: string, resourceType: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('bookmarks').insert({
    user_id: user.id,
    collection_id: collectionId,
    resource_id: resourceId,
    resource_type: resourceType
  })

  revalidatePath('/dashboard')
}

export async function getUserCollections() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Fetch collections
  const { data } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', user.id)
   
  return data || []
}

export async function createCollection(name: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
   
    await supabase.from('collections').insert({
      user_id: user.id,
      name: name
    })
     
    revalidatePath('/dashboard')
}