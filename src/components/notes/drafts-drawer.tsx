"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FileText, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Mock Data Type
type Draft = {
  id: string
  title: string
  preview: string
  last_edited_at: string
}

export function DraftsDrawer({ drafts }: { drafts: Draft[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="h-4 w-4" />
          Open Drafts
          <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
            {drafts.length}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Unfinished Notes</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {drafts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No drafts found.</p>
          ) : (
            drafts.map((draft) => (
              <Link 
                key={draft.id} 
                href={`/notes/edit/${draft.id}`}
                className="block group"
              >
                <div className="rounded-lg border p-3 transition-colors hover:bg-accent hover:border-primary/50">
                  <h4 className="font-semibold group-hover:text-primary">
                    {draft.title || "Untitled Note"}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {draft.preview}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Edited {formatDistanceToNow(new Date(draft.last_edited_at))} ago</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}