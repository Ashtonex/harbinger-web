"use client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Pass in the user's earned badges
export function BadgeList({ badges }: { badges: any[] }) {
  if (badges.length === 0) return (
     <div className="text-xs text-muted-foreground italic">No badges yet. Keep going!</div>
  )

  return (
    <div className="flex gap-2 flex-wrap">
      <TooltipProvider>
        {badges.map((b) => (
          <Tooltip key={b.badge_id}>
            <TooltipTrigger>
              <div className="h-10 w-10 rounded-full bg-accent border flex items-center justify-center text-xl grayscale-0 hover:scale-110 transition-transform cursor-help shadow-sm">
                {/* If you have real images, use <img /> here. Using Emoji for MVP */}
                {b.badges.icon_url || '🏆'} 
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{b.badges.name}</p>
              <p className="text-xs">{b.badges.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}