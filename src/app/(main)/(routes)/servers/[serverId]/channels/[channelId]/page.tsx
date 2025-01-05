import { ChatHeader } from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async(
  { params }: ChannelIdPageProps
) => {

  const user = await currentProfile();
  if (!user) {
    return redirect("/");
  }

  const awaitedParams = await params;

  const channel = await db.channel.findUnique({
    where:{
      id:awaitedParams.channelId
    }
  });

  const member = await db.member.findFirst({
    where:{
      serverId: awaitedParams.serverId,
      userDataId: user.id,
    }
  });

  if (!member || !channel) {
    return redirect("/");
  }

  return (
    <div
      className="flex flex-col h-full"
    >
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  )
}

export default ChannelIdPage