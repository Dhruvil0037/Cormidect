import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from 'next/navigation';
import { ChannelType } from "@prisma/client";
import ServerHeader from "@/components/server/server-header";

interface ServerSideBarProps {
  serverId: string;
}

const ServerSideBar = async({serverId}:ServerSideBarProps) => {
  const user = await currentProfile();
  if(!user) return redirect('/');

  const server = await db.server.findUnique({
    where:{
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }
    }
  });

  if(!server) return redirect('/');
  const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT);
  const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO);
  const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO);
  const members = server?.members.filter(member => member.userDataId !== user.id);

  const role = server?.members.find(member => member.userDataId === user.id)?.role;

  return (
    <div className="flex flex-col h-full w-full dark:bg-[#20243B] bg-accent">
      <ServerHeader
        server={server}
        role={role}
      />
    </div>
  )
}

export default ServerSideBar