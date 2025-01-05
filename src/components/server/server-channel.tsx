"use client";

import { Channel, MemberRole, Server, ChannelType } from "@prisma/client";
import { Edit, Hash, Mic, Trash, Video, Lock } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "../navigation/action-tooltip";
import { ModalType, useModal } from "@/hooks/useModalStore";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  }

  const onAction = (e:React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full transition hover:bg-zinc-700/10 dark:hover:bg-accent dark:hover:text-accent-foreground mb-1",
        params?.channelId === channel.id &&
          "bg-zinc-700/10 text-accent-foreground dark:bg-accent dark:text-accent-foreground"
      )}
    >
      <Icon className={cn("flex-shrink-0 w-5 h-5 text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition",params?.channelId === channel.id && "text-foreground dark:text-accent-foreground")}/>
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition",
          params?.channelId === channel.id && "text-foreground dark:text-accent-foreground"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="Edit">
            <Edit
              onClick={(e) => onAction(e,"editChannel")}
              className="hidden group-hover:block w-4 h-4 text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Trash">
            <Trash
              onClick={(e) => onAction(e,"deleteChannel")}
              className="hidden group-hover:block w-4 h-4 text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto group-hover:block w-4 h-4 text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition" />
      )}
    </button>
  );
};

export default ServerChannel;
