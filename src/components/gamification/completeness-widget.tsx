"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle } from "lucide-react"

interface Props {
  data: {
    score: number
    missing: { label: string }[]
  }
}

export function CompletenessWidget({ data }: Props) {
  // Don't show if they are 100% complete
  if (data.score === 100) return null

  const radius = 30
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (data.score / 100) * circumference

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start gap-4">
        {/* The Circle */}
        <div className="relative h-20 w-20 flex-shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
            {/* Background Circle */}
            <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted/20" />
            {/* Progress Circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            {data.score}%
          </div>
        </div>

        {/* The "Fix It" List */}
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-sm">Complete your Profile</h3>
          <div className="space-y-1">
            {data.missing.slice(0, 2).map((item) => (
               <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                 <Circle className="h-3 w-3" /> {item.label}
               </div>
            ))}
          </div>
          <Button size="sm" variant="secondary" className="h-7 text-xs w-full mt-2">
            Finish Setup
          </Button>
        </div>
      </div>
    </Card>
  )
}