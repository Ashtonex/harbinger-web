import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { AuthProvider } from "@/context/AuthProvider";
import { AppNavbar } from "@/components/AppNavbar";
import { AppFooter } from "@/components/AppFooter"; 
// 1. IMPORT THE SMART HEADER
import { SmartHeader } from "@/components/ui/smart-header"; 

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
          <AuthProvider>
            <AppNavbar>
               {/* 2. Main Content Wrapper */}
               <div style={{ minHeight: '80vh' }}>
                 
                 {/* 3. PLACE IT HERE: It will automatically hide itself on Dashboard/Login */}
                 <SmartHeader />
                 
                 {children}
               </div>
               
               <AppFooter /> 
            </AppNavbar>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}