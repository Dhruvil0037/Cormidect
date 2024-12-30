"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
 const { setTheme } = useTheme()

 return (
   <DropdownMenu>
     <DropdownMenuTrigger asChild>
       <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
         <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
         <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
         <span className="sr-only">Toggle theme</span>
       </Button>
     </DropdownMenuTrigger>
     <DropdownMenuContent align="end" className="bg-background border-border">
       <DropdownMenuItem 
         onClick={() => setTheme("light")}
         className="text-foreground hover:bg-accent"
       >
         Light
       </DropdownMenuItem>
       <DropdownMenuItem 
         onClick={() => setTheme("dark")}
         className="text-foreground hover:bg-accent"
       >
         Dark
       </DropdownMenuItem>
       <DropdownMenuItem 
         onClick={() => setTheme("system")}
         className="text-foreground hover:bg-accent"
       >
         System
       </DropdownMenuItem>
     </DropdownMenuContent>
   </DropdownMenu>
 )
}