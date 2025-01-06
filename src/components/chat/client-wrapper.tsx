"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatInput} from "@/components/chat/chat-input";
import {MobileMessage} from "@/components/mobile-message-component";
import { Channel } from "@prisma/client";


interface ClientWrapperProps {
  channel: Channel;
}

const ClientWrapper = ({ channel }:ClientWrapperProps) => {
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
      <div className="flex-1">
        Future Messages
      </div>
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