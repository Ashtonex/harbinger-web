"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText, Video, PlayCircle } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns" // Run: npm install date-fns

// Define what the data looks like coming from DB
interface ActivityData {
  id: string
  resource_type: string // 'bible', 'sermon', 'note'
  resource_id: string
  meta_data: {
    title?: string
    subtitle?: string
    link?: string
    progress?: number
  } | null
  last_active_at: string
}

export function ResumeActivityCard({ data }: { data: ActivityData }) {
  // 1. Helper to get the right icon based on type
  const getIcon = () => {
    switch (data.resource_type) {
      case 'bible': return <BookOpen className="h-5 w-5 text-blue-500" />
      case 'note': return <FileText className="h-5 w-5 text-amber-500" />
      case 'sermon': return <Video className="h-5 w-5 text-purple-500" />
      default: return <PlayCircle className="h-5 w-5 text-gray-500" />
    }
  }

  // 2. Helper to get the right label
  const getLabel = () => {
    switch (data.resource_type) {
      case 'bible': return 'Continue Reading'
      case 'note': return 'Resume Writing'
      case 'sermon': return 'Resume Watching'
      default: return 'Resume'
    }
  }

  // Fallback values if metadata is missing
  const title = data.meta_data?.title || "Untitled Activity"
  const subtitle = data.meta_data?.subtitle || "Click to view"
  const href = data.meta_data?.link || "#"

  return (
    <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors group">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-muted rounded-md group-hover:bg-primary/10 transition-colors">
            {getIcon()}
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            {data.resource_type}
          </span>
        </div>
        
        <h3 className="font-bold text-sm line-clamp-1">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{subtitle}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {formatDistanceToNow(new Date(data.last_active_at))} ago
        </span>
        
        <Link href={href}>
          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 group-hover:text-primary group-hover:translate-x-1 transition-all">
            {getLabel()} <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}