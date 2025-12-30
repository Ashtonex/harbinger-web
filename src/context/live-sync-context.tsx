"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

type LiveSyncContextType = {
  currentVerse: string | null;
  isLive: boolean;
  broadcastVerse: (ref: string) => Promise<void>;
};

const LiveSyncContext = createContext<LiveSyncContextType | undefined>(undefined);

export function LiveSyncProvider({ children }: { children: React.ReactNode }) {
  const [currentVerse, setCurrentVerse] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Subscribe to the 'live_service' channel
    const channel = supabase.channel("live_service");

    channel
      .on("broadcast", { event: "pulpit_verse" }, (payload) => {
        console.log("📡 Signal Received:", payload);
        const verseRef = payload.payload.ref;
        
        setCurrentVerse(verseRef);
        setIsLive(true);

        // OPTIONAL: Auto-navigate immediately (Killer Feature)
        // Parse "John 3:16" -> /bible/John/3?focus=16
        handleAutoNavigation(verseRef);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Connected to Live Service");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleAutoNavigation = (ref: string) => {
    // Basic parser: Assumes format "Book Chapter:Verse" (e.g., "John 3:16")
    try {
      // Split "John 3:16" into parts
      // This regex handles "1 John 3:16" or "John 3:16"
      const match = ref.match(/^(.+)\s(\d+):(\d+)$/);
      
      if (match) {
        const book = match[1];
        const chapter = match[2];
        const verse = match[3];

        notifications.show({
          title: "Pulpit Sync",
          message: `Moving to ${ref}...`,
          color: "blue",
          autoClose: 2000,
        });

        router.push(`/bible/${book}/${chapter}?focus=${verse}`);
      }
    } catch (e) {
      console.error("Failed to parse verse ref:", e);
    }
  };

  const broadcastVerse = async (ref: string) => {
    const channel = supabase.channel("live_service");
    await channel.subscribe();
    await channel.send({
      type: "broadcast",
      event: "pulpit_verse",
      payload: { ref },
    });
    console.log("📡 Broadcast Sent:", ref);
  };

  return (
    <LiveSyncContext.Provider value={{ currentVerse, isLive, broadcastVerse }}>
      {children}
    </LiveSyncContext.Provider>
  );
}

export const useLiveSync = () => {
  const context = useContext(LiveSyncContext);
  if (!context) throw new Error("useLiveSync must be used within LiveSyncProvider");
  return context;
};