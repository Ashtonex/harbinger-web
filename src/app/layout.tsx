import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css"; // 1. Import Notification Styles
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications"; // 2. Import Notifications System
import { AuthProvider } from "@/context/AuthProvider";
import { AppNavbar } from "@/components/AppNavbar";
import { AppFooter } from "@/components/AppFooter"; 
import { SmartHeader } from "@/components/ui/smart-header"; 
import { LiveSyncProvider } from "@/context/live-sync-context"; // 3. Import Live Sync
import { Analytics } from "@vercel/analytics/react"; // 4. Import Analytics

export const metadata = {
  title: "Harbinger",
  description: "The Digital Tabernacle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          {/* 5. Enable Notifications (Must be inside MantineProvider) */}
          <Notifications position="top-right" zIndex={1000} />
          
          <AuthProvider>
            {/* 6. Wrap App with LiveSync so it listens everywhere */}
            <LiveSyncProvider>
              <AppNavbar>
                 <div style={{ minHeight: '80vh' }}>
                   <SmartHeader />
                   {children}
                 </div>
                 
                 <AppFooter /> 
              </AppNavbar>
            </LiveSyncProvider>
          </AuthProvider>
        </MantineProvider>
        
        {/* 7. Add Analytics Component */}
        <Analytics />
      </body>
    </html>
  );
}