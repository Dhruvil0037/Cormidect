"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { 
  ChevronDown,
  Settings,
  Users,
  UserPlus,
  PlusCircle,
  Trash,
  LogOut,
} from "lucide-react";
import { useModal } from "@/hooks/useModalStore";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?:MemberRole;
}


const ServerHeader = ({server, role}:ServerHeaderProps) => {

  const { onOpen } = useModal();

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
      <DropdownMenuContent 
        className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
      >
        {isModerator && (
          <DropdownMenuItem
          onClick={()=>onOpen("invite", {server})}
            className="px-3 py-2 text-sm cursor-pointer text-indigo-600 dark:text-indigo-400"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={()=>onOpen("editServer", {server})}
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={()=>onOpen("members", {server})}
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick = {()=>onOpen("createChannel", {server})}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuSeparator/>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={()=>onOpen("deleteServer", {server})}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={()=>onOpen("leaveServer", {server})}
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto"/>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader