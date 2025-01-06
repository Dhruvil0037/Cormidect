import { Hash } from "lucide-react";
import UserAvatar from "../user-avatar";
import { SocketIndicator } from "../socket-indicator";
import { ChatVideoButton } from "./chat-video-button";

interface ChatHeaderProps {
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-b-2 border-neutral-200 dark:border-purple-800 hover:bg-purple-700/10 dark:hover:bg-zinc-700/50 transition">      
        {type === "channel" && (
          <Hash className="w-5 h-5 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition mr-2" />
        )}
        {type === "conversation" && (
          <UserAvatar 
            src = {imageUrl}
            className="h-8 w-8 md:h-8 md:w-8 mr-2"
          />
        )}
        <p className="font-semibold text-md ">
          {name}
        </p>
        <div className="ml-auto flex items-center">
          {type === "conversation" && (
            <ChatVideoButton/> 
          )}
          <SocketIndicator />
        </div>
    </div>
  );
};