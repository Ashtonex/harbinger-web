import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css"; 
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications"; 
import { AuthProvider } from "@/context/AuthProvider";
import { AppNavbar } from "@/components/AppNavbar";
import { AppFooter } from "@/components/AppFooter"; 
import { SmartHeader } from "@/components/ui/smart-header"; 
import { LiveSyncProvider } from "@/context/live-sync-context"; 

// 1. Import BOTH Vercel tools
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
          {/* 2. Notifications System */}
          <Notifications position="top-right" zIndex={1000} />
          
          <AuthProvider>
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
        
        {/* 3. Add Vercel Monitoring Components */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}