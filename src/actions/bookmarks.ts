'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBookmark(collectionId: string, resourceId: string, resourceType: string) {
<<<<<<< HEAD
  // FIX: Added 'await' here
=======
  // FIX 1: Added 'await'
>>>>>>> bd570fe (Initial commit - Phase 8 Complete 2)
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
<<<<<<< HEAD
  // FIX: Added 'await' here
=======
  // FIX 2: Added 'await'
>>>>>>> bd570fe (Initial commit - Phase 8 Complete 2)
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
<<<<<<< HEAD
    // FIX: Added 'await' here
=======
    // FIX 3: Added 'await'
>>>>>>> bd570fe (Initial commit - Phase 8 Complete 2)
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
   
    await supabase.from('collections').insert({
      user_id: user.id,
      name: name
    })
     
    revalidatePath('/dashboard')
}
