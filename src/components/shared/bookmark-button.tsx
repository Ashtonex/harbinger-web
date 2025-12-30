"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Bookmark, Plus } from "lucide-react"
import { createBookmark } from "@/actions/bookmarks" // Server Action

export function BookmarkButton({ resourceId, resourceType }: { resourceId: string, resourceType: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Ideally, fetch these from DB. Mocked for now.
  const collections = [
    { id: '1', name: 'Favorites' },
    { id: '2', name: 'Study of John' }
  ]

  const handleSave = async (collectionId: string) => {
    await createBookmark(collectionId, resourceId, resourceType)
    setIsOpen(false)
    // Add toast notification here
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Bookmark className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <p className="text-xs font-semibold px-2 mb-2 text-muted-foreground">Save to...</p>
        <div className="space-y-1">
          {collections.map((col) => (
            <Button 
              key={col.id} 
              variant="ghost" 
              className="w-full justify-start h-8 text-sm"
              onClick={() => handleSave(col.id)}
            >
              {col.name}
            </Button>
          ))}
          <div className="h-px bg-border my-1" />
          <Button variant="ghost" className="w-full justify-start h-8 text-sm text-blue-500">
            <Plus className="mr-2 h-3 w-3" /> New Collection
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}