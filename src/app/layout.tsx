import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/provider.tsx/theme-provider";
import { cn } from "@/lib/utils"
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
        <body
          className={cn(font.className, "bg-white dark:bg-[#313338]")}
        >
           <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="cormidect-theme"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
