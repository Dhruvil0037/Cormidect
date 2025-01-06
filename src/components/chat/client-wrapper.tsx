"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatInput} from "@/components/chat/chat-input";
import {MobileMessage} from "@/components/mobile-message-component";
import { Channel , Member } from "@prisma/client";
import ChatMessages from "./chat-messages";


interface ClientWrapperProps {
  channel: Channel;
  member: Member;
}

const ClientWrapper = ({ channel, member }:ClientWrapperProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return <MobileMessage />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel.id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId
        }}
        paramKey="channelId"
        paramValue={channel.id}
      />
      <ChatInput 
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel.id,
          serverId: channel.serverId
        }}
      />
    </div>
  );
};

export default ClientWrapper ;