"use client";

import { cn } from "@/lib/utils";
import { Member, User, Server, MemberRole } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../user-avatar";

interface ServerMemberProps {
  member: Member & { user: User };
  server: Server;
}

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.GUEST]: null,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversation/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full transition hover:bg-zinc-700/10 dark:hover:bg-accent dark:hover:text-accent-foreground mb-1",
        params?.memberId === member.id &&
          "bg-zinc-700 dark:bg-accent dark:text-accent-foreground"
      )}
    >
      <UserAvatar
        src={member.user.imageUrl}
        className="w-8 h-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          "font-semibold text-sm text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition",
          params?.memberId === member.id && "dark:text-accent-foreground"
        )}
      >
        {member.user.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
