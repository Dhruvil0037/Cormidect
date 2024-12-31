import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/provider.tsx/theme-provider";
import { cn } from "@/lib/utils"
import ModalProvider from "@/components/provider.tsx/modal-provider";
const font = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cormidect",
  description: "Cormidect is a web application offering seamless communication and collaboration through text, voice, and video chats, community creation, role management, and real-time interactions.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
      <body className={cn(
        font.className
      )}>
           <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="cormidect-theme"
          >
            <ModalProvider/>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
