"use client";
import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import { ActionTooltip } from "../navigation/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/useModalStore";

interface ServerSectionProps {
  label: string;
  role?: string;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {

  const {onOpen} = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-muted dark:text-neutral-400 ">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip
          label={`Create ${label.toLowerCase().slice(0, -1)}`}
          side="top"
          >
            <button 
              onClick={()=>onOpen("createChannel" , {channelType})}
            className="text-muted dark:text-neutral-400 transition hover:text-accent dark:hover:text-accent-foreground">
              <Plus className="w-4 h-4"/>
            </button>
        </ActionTooltip>
      )}
      { role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip
          label="Manage members"
          side="top"
        >
          <button
            onClick={()=>onOpen("members" , {server})}
            className="text-muted dark:text-neutral-400 transition hover:text-accent dark:hover:text-accent-foreground"
          >
            <Settings className="w-4 h-4"/>
          </button>
        </ActionTooltip> 
      )}
    </div>
    );
};

export default ServerSection;
