"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { markNotificationRead } from "@/actions/notifications" // We will make this next

// Mock type - replace with your Supabase generated type
type Notification = {
  id: string
  type: 'amen' | 'announcement' | 'message'
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function InboxWidget({ initialData }: { initialData: Notification[] }) {
  const [notifications, setNotifications] = useState(initialData)

  const handleDismiss = async (id: string) => {
    // 1. Optimistic Update (Remove from UI immediately)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    // 2. Server Update
    await markNotificationRead(id)
  }

  const handleAction = async (id: string, type: string) => {
    // Custom logic: e.g., if "Amen", maybe send a "Thanks" back
    console.log(`Action taken on ${type}`)
    handleDismiss(id) // Auto-dismiss after action
  }

  // Icon Helper
  const getIcon = (type: string) => {
    switch (type) {
      case 'amen': return <Heart className="h-4 w-4 text-rose-500" />
      case 'announcement': return <Bell className="h-4 w-4 text-amber-500" />
      default: return <MessageCircle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Inbox</CardTitle>
          <span className="text-xs text-muted-foreground">{notifications.length} Unread</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="amen">Prayers</TabsTrigger>
            <TabsTrigger value="announcement">Updates</TabsTrigger>
          </TabsList>

          {/* Render List Logic */}
          {["all", "amen", "announcement"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {notifications
                .filter((n) => tab === "all" || n.type === tab)
                .map((n) => (
                <div key={n.id} className="flex gap-4 items-start p-3 rounded-lg border bg-card/50 hover:bg-accent transition-colors">
                  <div className="mt-1 bg-background p-2 rounded-full border shadow-sm">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    
                    {/* INLINE ACTIONS */}
                    <div className="flex gap-2 mt-2">
                      {n.type === 'amen' && (
                        <Button 
                          size="xs" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => handleAction(n.id, 'amen')}
                        >
                          Receive Prayer
                        </Button>
                      )}
                      <Button 
                        size="xs" 
                        variant="ghost" 
                        className="h-7 text-xs hover:text-red-500"
                        onClick={() => handleDismiss(n.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] text-muted-foreground">
                       {/* You can use a library like 'date-fns' here */}
                       2m ago 
                    </span>
                    {!n.is_read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                  </div>
                </div>
              ))}
              
              {notifications.length === 0 && (
                 <div className="text-center py-8 text-muted-foreground">
                    <Check className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">You are all caught up!</p>
                 </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}