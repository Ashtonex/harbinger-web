import { CreditCard, BookOpen, MessageSquare, PenTool, Users, Calendar } from "lucide-react"

// This maps the IDs from the database to actual UI elements
export const ACTION_MAP = {
  give: {
    label: "Give / Tithe",
    icon: <CreditCard className="h-6 w-6 text-emerald-500" />,
    href: "/giving",
    color: "bg-emerald-100/50"
  },
  bible: {
    label: "Read Bible",
    icon: <BookOpen className="h-6 w-6 text-blue-500" />,
    href: "/bible",
    color: "bg-blue-100/50"
  },
  prayer: {
    label: "Prayer Wall",
    icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
    href: "/prayers",
    color: "bg-purple-100/50"
  },
  notes: {
    label: "Sermon Notes",
    icon: <PenTool className="h-6 w-6 text-amber-500" />,
    href: "/notes",
    color: "bg-amber-100/50"
  },
  events: {
    label: "Events",
    icon: <Calendar className="h-6 w-6 text-pink-500" />,
    href: "/events",
    color: "bg-pink-100/50"
  },
  group: {
    label: "Small Groups",
    icon: <Users className="h-6 w-6 text-indigo-500" />,
    href: "/groups",
    color: "bg-indigo-100/50"
  }
} as const;

export type ActionKey = keyof typeof ACTION_MAP;