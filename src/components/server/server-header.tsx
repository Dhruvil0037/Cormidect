"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,

} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?:MemberRole;
}


const ServerHeader = ({server, role}:ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger  
        className="focus:outline-none"
        asChild
      >
        <button 
        className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-purple-800 border-b-2 hover:bg-purple-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}    
          <ChevronDown className="w-5 h-5 ml-auto"/>
        </button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}

export default ServerHeader